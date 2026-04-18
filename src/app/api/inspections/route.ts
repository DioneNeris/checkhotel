import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    let roomId: string;
    let maidId: string | null;
    let items: any[];
    let roomStatus: string;
    let photos: { [key: string]: File } = {};

    if (contentType.includes("application/json")) {
      const body = await req.json();
      roomId = body.roomId;
      maidId = body.maidId;
      items = body.items;
      roomStatus = body.roomStatus;
    } else {
      const formData = await req.formData();
      roomId = formData.get("roomId") as string;
      maidId = formData.get("maidId") as string;
      const itemsJson = formData.get("items") as string;
      items = JSON.parse(itemsJson || "[]");
      roomStatus = formData.get("roomStatus") as string;
      
      // Collect photos if any (legacy or direct upload)
      for (const item of items) {
        const photo = formData.get(`photo_${item.checklistItemId}`) as File;
        if (photo) photos[item.checklistItemId] = photo;
      }
    }

    if (!roomId) {
      return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
    }

    // Idempotency check: Check if an inspection for this room already exists today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingInspection = await prisma.inspection.findFirst({
      where: {
        roomId,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    if (existingInspection) {
      return NextResponse.json({ 
        success: true, 
        inspectionId: existingInspection.id,
        alreadyExists: true 
      });
    }

    let hasIssues = items.some((item: any) => item.status === "ISSUE");
    let inspectionStatus: "APPROVED" | "PENDING" = hasIssues ? "PENDING" : "APPROVED";
    
    const inspection = await prisma.inspection.create({
      data: {
        roomId,
        userId: session.user.id,
        maidId: maidId || null,
        status: inspectionStatus,
        items: {
          create: items.map((item: any) => ({
            checklistItemId: item.checklistItemId,
            status: item.status,
            observation: item.observation,
          }))
        }
      },
      include: {
        items: true
      }
    });

    // Update room status
    await prisma.room.update({
      where: { id: roomId },
      data: { status: roomStatus as any }
    });

    // Handle photos (if provided in FormData)
    if (Object.keys(photos).length > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const photoUpdates: Promise<any>[] = [];

      for (const inspectionItem of inspection.items) {
        const file = photos[inspectionItem.checklistItemId];
        if (file) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          const fileName = `${inspection.id}_${inspectionItem.id}_${Date.now()}.jpg`;
          const filePath = path.join(uploadDir, fileName);
          
          fs.writeFileSync(filePath, buffer);
          
          photoUpdates.push(
            prisma.photo.create({
              data: {
                inspectionItemId: inspectionItem.id,
                url: `/uploads/${fileName}`
              }
            })
          );
        }
      }
      await Promise.all(photoUpdates);
    }

    return NextResponse.json({ success: true, inspectionId: inspection.id });
  } catch (error: any) {
    console.error("Error submitting inspection:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}


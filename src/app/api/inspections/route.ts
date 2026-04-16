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

    const formData = await req.formData();
    const roomId = formData.get("roomId") as string;
    const maidId = formData.get("maidId") as string;
    const itemsJson = formData.get("items") as string;
    const roomStatus = formData.get("roomStatus") as string; // FREE, PENDING, APPROVED, NO_ACCESS
    
    if (!roomId) {
      return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
    }

    const parsedItems = JSON.parse(itemsJson || "[]");
    
    let hasIssues = false;
    for (const item of parsedItems) {
      if (item.status === "ISSUE") hasIssues = true;
    }

    // Determine target inspection status
    let inspectionStatus: "APPROVED" | "PENDING" = hasIssues ? "PENDING" : "APPROVED";
    
    const inspection = await prisma.inspection.create({
      data: {
        roomId,
        userId: session.user.id,
        maidId: maidId || null,
        status: inspectionStatus,
        items: {
          create: parsedItems.map((item: any) => ({
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

    // Handle photos for issues
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const photoUpdates: Promise<any>[] = [];

    for (const inspectionItem of inspection.items) {
      const file = formData.get(`photo_${inspectionItem.checklistItemId}`) as File;
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

    // TODO: Generate PDF report as asked in requirements

    return NextResponse.json({ success: true, inspectionId: inspection.id });
  } catch (error: any) {
    console.error("Error submitting inspection:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inspectionId = params.id;
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const checklistItemId = formData.get("checklistItemId") as string;

    if (!file || !checklistItemId) {
      return NextResponse.json({ error: "Missing file or checklistItemId" }, { status: 400 });
    }

    // Find the InspectionItem to link the photo
    const inspectionItem = await prisma.inspectionItem.findFirst({
      where: {
        inspectionId,
        checklistItemId
      }
    });

    if (!inspectionItem) {
      return NextResponse.json({ error: "Inspection item not found" }, { status: 404 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileName = `${inspectionId}_${inspectionItem.id}_${Date.now()}.jpg`;
    const filePath = path.join(uploadDir, fileName);
    
    fs.writeFileSync(filePath, buffer);
    
    const photo = await prisma.photo.create({
      data: {
        inspectionItemId: inspectionItem.id,
        url: `/uploads/${fileName}`
      }
    });

    return NextResponse.json({ success: true, photoId: photo.id });
  } catch (error: any) {
    console.error("Error uploading photo:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

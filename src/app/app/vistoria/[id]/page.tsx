import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { InspectionForm } from "@/components/InspectionForm";

export default async function VistoriaPage({ params }: { params: { id: string } }) {
  const room = await prisma.room.findUnique({
    where: { id: params.id }
  });

  if (!room) {
    notFound();
  }

  const checklistItems = await prisma.checklistItem.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <InspectionForm room={room} checklistItems={checklistItems} />
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { RoomManagement } from "@/components/admin/RoomManagement";

export const dynamic = "force-dynamic";

export default async function QuartosPage() {
  const rooms = await prisma.room.findMany({
    orderBy: { number: "asc" },
  });

  return (
    <div className="animate-fade-in">
      <RoomManagement rooms={rooms} />
    </div>
  );
}


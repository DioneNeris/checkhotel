import { prisma } from "@/lib/prisma";
import { RoomManagement } from "@/components/admin/RoomManagement";

export const dynamic = "force-dynamic";

export default async function QuartosPage() {
  const rooms = await prisma.room.findMany({
    orderBy: { number: "asc" },
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <RoomManagement initialRooms={rooms} />
    </div>
  );
}


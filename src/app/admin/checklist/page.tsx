import { prisma } from "@/lib/prisma";
import { ChecklistManagement } from "@/components/admin/ChecklistManagement";

export const dynamic = "force-dynamic";

export default async function ChecklistPage() {
  const items = await prisma.checklistItem.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ChecklistManagement initialItems={items} />
    </div>
  );
}


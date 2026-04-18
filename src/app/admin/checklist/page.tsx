import { prisma } from "@/lib/prisma";
import { ChecklistManagement } from "@/components/admin/ChecklistManagement";

export const dynamic = "force-dynamic";

export default async function ChecklistPage() {
  const items = await prisma.checklistItem.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="animate-fade-in">
      <ChecklistManagement items={items} />
    </div>
  );
}


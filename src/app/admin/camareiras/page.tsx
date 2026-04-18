import { prisma } from "@/lib/prisma";
import { MaidManagement } from "@/components/admin/MaidManagement";

export const dynamic = "force-dynamic";

export default async function CamareirasPage() {
  const maids = await prisma.maid.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="animate-fade-in">
      <MaidManagement maids={maids} />
    </div>
  );
}


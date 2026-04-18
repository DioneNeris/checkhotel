import { prisma } from "@/lib/prisma";
import { MaidManagement } from "@/components/admin/MaidManagement";

export const dynamic = "force-dynamic";

export default async function CamareirasPage() {
  const maids = await prisma.maid.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <MaidManagement initialMaids={maids} />
    </div>
  );
}


import { prisma } from "@/lib/prisma";
import { UserManagement } from "@/components/admin/UserManagement";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <UserManagement initialUsers={users} />
    </div>
  );
}


import { prisma } from "@/lib/prisma";
import { UserManagement } from "@/components/admin/UserManagement";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    }
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <UserManagement initialUsers={users} />
    </div>
  );
}


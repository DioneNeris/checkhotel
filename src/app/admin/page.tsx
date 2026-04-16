import { prisma } from "@/lib/prisma";
import { Users, ShieldCheck, Hotel, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const totalUsers = await prisma.user.count({ where: { role: "USER" } });
  const totalMaids = await prisma.maid.count();
  const totalRooms = await prisma.room.count();
  const totalInspections = await prisma.inspection.count();

  const stats = [
    { name: "Recepcionistas", value: totalUsers, icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { name: "Camareiras", value: totalMaids, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Quartos", value: totalRooms, icon: Hotel, color: "text-amber-500", bg: "bg-amber-500/10" },
    { name: "Vistorias Realizadas", value: totalInspections, icon: CheckCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Visão geral do sistema de vistorias do hotel.
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <dt>
              <div className={`absolute rounded-xl p-3 ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-slate-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
              <p className="text-2xl font-semibold text-slate-900">
                {item.value}
              </p>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Últimas Vistorias</h2>
          <div className="text-center py-10 text-slate-400 text-sm">
            Nenhuma vistoria recente.
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Desempenho Camareiras (Mês)</h2>
          <div className="text-center py-10 text-slate-400 text-sm">
            Dados insuficientes.
          </div>
        </div>
      </div>
    </div>
  );
}

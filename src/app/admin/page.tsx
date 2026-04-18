import { prisma } from "@/lib/prisma";
import { 
  Users, 
  Bed, 
  CheckSquare, 
  History, 
  TrendingUp, 
  AlertCircle,
  ClipboardCheck,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const stats = {
    users: await prisma.user.count(),
    rooms: await prisma.room.count(),
    checklists: await prisma.checklistItem.count(),
    inspections: 0 // Placeholder for real metrics
  };

  const dashboardCards = [
    { 
      title: "Colaboradores", 
      value: stats.users, 
      icon: Users, 
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      title: "Unidades", 
      value: stats.rooms, 
      icon: Bed, 
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    { 
      title: "Requisitos", 
      value: stats.checklists, 
      icon: CheckSquare, 
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    { 
      title: "Vistorias/Hoje", 
      value: "12", 
      icon: History, 
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Visão geral da operação</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {card.title}
              </CardTitle>
              <div className={`${card.bg} ${card.color} p-2 rounded-lg`}>
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{card.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600">+4% desde ontem</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-blue-600" />
                Últimas Atividades
              </CardTitle>
              <p className="text-xs text-slate-500">Acompanhamento em tempo real das vistorias</p>
            </div>
            <Badge variant="outline" className="text-[10px] font-bold py-0.5">VER TUDO</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    10{i+1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">Quarto 10{i+1}</p>
                    <p className="text-[11px] text-slate-500">Vistoria finalizada por Maria Silva</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[9px] font-black border-none">LIMPO</Badge>
                    <p className="text-[10px] text-slate-400 mt-1">10 min atrás</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Atenção Requerida
            </CardTitle>
            <p className="text-xs text-blue-100">Unidades aguardando liberação</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[402, 305].map((room) => (
              <div key={room} className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <span className="font-bold text-lg">#{room}</span>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Manutenção</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[10px]">Agendado: Hoje</span>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full py-3 bg-white text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all">
              Gerenciar Equipe
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

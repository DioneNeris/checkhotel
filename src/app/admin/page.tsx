import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { Users, ShieldCheck, Hotel, CheckCircle, ArrowUpRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const totalUsers = await prisma.user.count({ where: { role: Role.RECEPTIONIST } });
  const totalMaids = await prisma.maid.count();
  const totalRooms = await prisma.room.count();
  const totalInspections = await prisma.inspection.count();

  const stats = [
    { 
      name: "Recepcionistas", 
      value: totalUsers, 
      icon: Users, 
      description: "Equipe de recepção ativa",
      trend: "+2 hoje"
    },
    { 
      name: "Camareiras", 
      value: totalMaids, 
      icon: ShieldCheck, 
      description: "Equipe de limpeza",
      trend: "100% ativas"
    },
    { 
      name: "Quartos", 
      value: totalRooms, 
      icon: Hotel, 
      description: "Capacidade total",
      trend: "85% ocupação"
    },
    { 
      name: "Vistorias", 
      value: totalInspections, 
      icon: CheckCircle, 
      description: "Realizadas no mês",
      trend: "+12% vs mês anterior"
    },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Badge variant="outline" className="mb-4 border-accent/30 text-accent font-semibold tracking-wider px-3 py-1">
            SISTEMA DE GESTÃO ELITE
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">
            Dashboard Executivo
          </h1>
          <p className="mt-3 text-lg text-muted-foreground font-medium max-w-2xl">
            Bem-vindo ao centro de comando do CheckHotel. Monitore vistorias, gerencie equipes e otimize a experiência dos hóspedes.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <TrendingUp className="text-accent h-6 w-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-accent font-bold">Status Global</div>
              <div className="text-lg font-bold">Excelente</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => (
          <Card key={item.name} className="relative overflow-hidden group hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 border-border/50">
            {/* Design Anchor: Subtle Gold Gradient Border on Top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            
            <CardHeader className="pb-2 space-y-0">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-primary/5 group-hover:bg-accent/10 transition-colors duration-300">
                  <item.icon className="h-5 w-5 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <Badge variant="ghost" className="text-[10px] text-muted-foreground font-bold tracking-tighter">
                  {item.trend}
                </Badge>
              </div>
              <CardTitle className="text-sm font-medium text-muted-foreground pt-4 uppercase tracking-widest">
                {item.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold tracking-tight">{item.value}</div>
                <ArrowUpRight className="h-4 w-4 text-accent/0 group-hover:text-accent/100 transition-all duration-500 translate-x-2 group-hover:translate-x-0" />
              </div>
              <CardDescription className="text-[11px] mt-1 font-medium italic">
                {item.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-serif">Últimas Vistorias</CardTitle>
                <CardDescription>Atividades recentes capturadas em tempo real</CardDescription>
              </div>
              <Badge variant="secondary" className="font-bold">LIVE</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center animate-pulse">
                <Hotel className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Aguardando dados de vistoria...</p>
                <p className="text-xs text-muted-foreground/50 italic">Novos relatórios aparecerão aqui automaticamente.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 overflow-hidden relative">
          {/* Subtle Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          <CardHeader>
            <CardTitle className="text-xl font-serif">Performance</CardTitle>
            <CardDescription>Taxa de aprovação por camareira</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl font-serif text-accent/20 mb-4 tracking-tighter">0%</div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Sem dados disponíveis</p>
                <p className="text-xs text-muted-foreground/50">Inicie vistorias para ver as métricas.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

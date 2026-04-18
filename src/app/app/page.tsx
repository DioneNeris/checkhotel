import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { DoorOpen, Clock, CheckCircle, Ban, Search, Bed, ArrowRight } from "lucide-react";
import { RoomStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default async function AppDashboard() {
  const rooms = await prisma.room.findMany({
    orderBy: { number: 'asc' }
  });

  const getStatusStyles = (status: RoomStatus) => {
    switch (status) {
      case "FREE": return {
        card: "bg-emerald-50/50 border-emerald-100/50 hover:bg-emerald-50",
        icon: "text-emerald-500 bg-emerald-100/50",
        label: "Livre",
        badge: "bg-emerald-100 text-emerald-700"
      };
      case "PENDING": return {
        card: "bg-amber-50/50 border-amber-100/50 hover:bg-amber-50",
        icon: "text-amber-500 bg-amber-100/50",
        label: "Pendente",
        badge: "bg-amber-100 text-amber-700"
      };
      case "APPROVED": return {
        card: "bg-indigo-50/50 border-indigo-100/50 hover:bg-indigo-50",
        icon: "text-indigo-500 bg-indigo-100/50",
        label: "Aprovado",
        badge: "bg-indigo-100 text-indigo-700"
      };
      case "NO_ACCESS": return {
        card: "bg-rose-50/50 border-rose-100/50 hover:bg-rose-50",
        icon: "text-rose-500 bg-rose-100/50",
        label: "Sem Acesso",
        badge: "bg-rose-100 text-rose-700"
      };
      default: return {
        card: "bg-slate-50 border-slate-200",
        icon: "text-slate-400 bg-slate-100",
        label: "Desconhecido",
        badge: "bg-slate-100 text-slate-600"
      };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-serif font-black text-foreground tracking-tight">Unidades</h1>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Selecione para vistoria</p>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
        <Input
          placeholder="Buscar quarto por número..."
          className="h-14 pl-11 bg-card/50 border-border/50 rounded-2xl focus-visible:ring-accent shadow-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {rooms.length === 0 ? (
           <div className="col-span-full py-20 text-center text-muted-foreground bg-muted/20 rounded-[2rem] border border-dashed border-border/50">
              <Bed className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium italic">Nenhuma unidade disponível no momento.</p>
           </div>
        ) : (
          rooms.map(room => {
            const styles = getStatusStyles(room.status);
            return (
              <Link 
                href={`/app/vistoria/${room.id}`} 
                key={room.id}
                className={`group relative flex flex-col p-6 rounded-[2rem] border transition-all active:scale-95 shadow-sm ${styles.card}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${styles.icon}`}>
                    <Bed className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
                
                <div className="mt-auto">
                  <h3 className="text-3xl font-serif font-black text-foreground mb-1 leading-none">{room.number}</h3>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${room.status === 'FREE' ? 'bg-emerald-500' : room.status === 'NO_ACCESS' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{styles.label}</span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

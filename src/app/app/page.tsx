import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { DoorOpen, Clock, CheckCircle, Ban, Search, Bed, ArrowRight, CheckCircle2 } from "lucide-react";
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
        icon: "text-emerald-600 bg-white",
        label: "Livre",
        badge: "bg-emerald-100 text-emerald-700"
      };
      case "PENDING": return {
        card: "bg-amber-50/50 border-amber-100/50 hover:bg-amber-50",
        icon: "text-amber-600 bg-white",
        label: "Pendente",
        badge: "bg-amber-100 text-amber-700"
      };
      case "APPROVED": return {
        card: "bg-blue-50/50 border-blue-100/50 hover:bg-blue-50",
        icon: "text-blue-600 bg-white",
        label: "Aprovado",
        badge: "bg-blue-100 text-blue-700"
      };
      case "NO_ACCESS": return {
        card: "bg-rose-50/50 border-rose-100/50 hover:bg-rose-50",
        icon: "text-rose-600 bg-white",
        label: "Sem Acesso",
        badge: "bg-rose-100 text-rose-700"
      };
      default: return {
        card: "bg-slate-50 border-slate-200",
        icon: "text-slate-400 bg-slate-100",
        label: "Status",
        badge: "bg-slate-100 text-slate-600"
      };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Unidades</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Selecione para vistoria</p>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        <Input
          placeholder="Buscar quarto por número..."
          className="h-12 pl-11 bg-white border-slate-200 rounded-xl focus-visible:ring-blue-100 shadow-sm transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {rooms.length === 0 ? (
           <div className="col-span-full py-16 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Bed className="w-10 h-10 mx-auto mb-4 opacity-20" />
              <p className="font-medium text-sm italic">Nenhuma unidade disponível.</p>
           </div>
        ) : (
          rooms.map(room => {
            const styles = getStatusStyles(room.status);
            return (
              <Link 
                href={`/app/vistoria/${room.id}`} 
                key={room.id}
                className={`group relative flex flex-col p-5 rounded-2xl border transition-all active:scale-95 shadow-sm ${styles.card}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm ${styles.icon} border-slate-100`}>
                    <Bed className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
                
                <div className="mt-auto">
                  <h3 className="text-2xl font-black text-slate-900 mb-0.5 leading-none tracking-tighter">{room.number}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${room.status === 'FREE' ? 'bg-emerald-500' : room.status === 'NO_ACCESS' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{styles.label}</span>
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

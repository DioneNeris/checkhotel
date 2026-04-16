import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DoorOpen, Clock, CheckCircle, Ban, Search } from "lucide-react";
import { RoomStatus } from "@prisma/client";

export default async function AppDashboard() {
  const rooms = await prisma.room.findMany({
    orderBy: { number: 'asc' }
  });

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case "FREE": return "bg-slate-100 text-slate-600 border-slate-200";
      case "PENDING": return "bg-amber-100 text-amber-700 border-amber-200";
      case "APPROVED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "NO_ACCESS": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getStatusLabel = (status: RoomStatus) => {
    switch (status) {
      case "FREE": return "Livre";
      case "PENDING": return "Pendente";
      case "APPROVED": return "Aprovado";
      case "NO_ACCESS": return "Sem Acesso";
      default: return "Desconhecido";
    }
  };

  const getStatusIcon = (status: RoomStatus) => {
    switch (status) {
      case "FREE": return <DoorOpen className="w-5 h-5 mb-1 opacity-70" />;
      case "PENDING": return <Clock className="w-5 h-5 mb-1 opacity-70" />;
      case "APPROVED": return <CheckCircle className="w-5 h-5 mb-1 opacity-70" />;
      case "NO_ACCESS": return <Ban className="w-5 h-5 mb-1 opacity-70" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quartos</h1>
        <p className="text-sm text-slate-500">Selecione um quarto para realizar a vistoria.</p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar quarto..."
          className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-all"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {rooms.length === 0 ? (
           <div className="col-span-full py-12 text-center text-slate-400">
              <DoorOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
              Nenhum quarto cadastrado.
           </div>
        ) : (
          rooms.map(room => (
            <Link 
              href={`/app/vistoria/${room.id}`} 
              key={room.id}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${getStatusColor(room.status)} shadow-sm`}
            >
              <div className="text-2xl font-black mb-1">{room.number}</div>
              {getStatusIcon(room.status)}
              <div className="text-[10px] font-bold uppercase tracking-wider mt-1">{getStatusLabel(room.status)}</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

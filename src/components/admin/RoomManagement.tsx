"use client";

import { Room } from "@prisma/client";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Bed, 
  Settings2,
  Trash2,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Ban
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export function RoomManagement({
  rooms,
}: {
  rooms: Room[];
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "FREE": return (
        <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px] gap-1.5">
          <CheckCircle2 className="w-3 h-3" /> LIBERADO
        </Badge>
      );
      case "PENDING": return (
        <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[10px] gap-1.5">
          <Clock className="w-3 h-3" /> PENDENTE
        </Badge>
      );
      case "NO_ACCESS": return (
        <Badge className="bg-rose-100 text-rose-700 border-none font-bold text-[10px] gap-1.5">
          <Ban className="w-3 h-3" /> SEM ACESSO
        </Badge>
      );
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">Inventário de Unidades</h2>
          <p className="text-xs text-slate-500 font-medium">Controle de quartos e apartamentos</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs gap-2">
              <ArrowUpDown className="w-3.5 h-3.5" /> Ordenar
           </Button>
           <Button className="rounded-xl font-bold text-xs gap-2 shadow-lg shadow-blue-100 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Nova Unidade
           </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <div className="relative group max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="Buscar unidade por número..." 
              className="pl-10 h-10 bg-white border-slate-200 rounded-xl text-sm focus-visible:ring-blue-100 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none text-[10px] font-bold">Total: {rooms.length}</Badge>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-20 text-xs font-black uppercase tracking-widest text-slate-400">#</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Descrição / Tipo</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Status Operacional</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">Andar</TableHead>
              <TableHead className="text-right text-xs font-black uppercase tracking-widest text-slate-400">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id} className="group hover:bg-slate-50 transition-colors border-slate-50">
                <TableCell className="py-4 font-black text-slate-900 text-lg tracking-tighter">
                  {room.number}
                </TableCell>
                <TableCell>
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">Standard Double</span>
                      <span className="text-[11px] text-slate-400">Ala Norte</span>
                   </div>
                </TableCell>
                <TableCell>{getStatusBadge(room.status)}</TableCell>
                <TableCell className="text-center">
                   <Badge variant="outline" className="text-slate-500 font-bold text-[10px] border-slate-200">
                      {Math.floor(parseInt(room.number) / 100)}º Piso
                   </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 transition-colors" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-100 shadow-xl">
                      <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Configurações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer gap-2 font-semibold text-xs py-2.5">
                        <Settings2 className="w-4 h-4 text-blue-500" /> Editar Unidade
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2 font-semibold text-xs py-2.5 text-rose-500 focus:bg-rose-50 focus:text-rose-600">
                        <Trash2 className="w-4 h-4" /> Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

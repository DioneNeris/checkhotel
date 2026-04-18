"use client";

import { Maid } from "@prisma/client";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  UserCircle, 
  Star,
  Trash2,
  Filter,
  Users
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function MaidManagement({
  maids,
}: {
  maids: Maid[];
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">Governança (Camareiras)</h2>
          <p className="text-xs text-slate-500 font-medium">Gestão da equipe de limpeza e manutenção</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs gap-2">
              <Filter className="w-3.5 h-3.5" /> Filtrar
           </Button>
           <Button className="rounded-xl font-bold text-xs gap-2 shadow-lg shadow-indigo-100 bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4" /> Nova Camareira
           </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative group max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <Input 
              placeholder="Buscar camareira..." 
              className="pl-10 h-10 bg-white border-slate-200 rounded-xl text-sm focus-visible:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Camareira</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">Desempenho</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400 text-center">Vistorias</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="text-right text-xs font-black uppercase tracking-widest text-slate-400">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maids.map((maid) => (
              <TableRow key={maid.id} className="group hover:bg-slate-50 transition-colors border-slate-50">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 rounded-xl border-2 border-white shadow-sm ring-1 ring-slate-100">
                      <AvatarFallback className="bg-indigo-50 text-indigo-600 font-black text-xs">
                        {maid.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-bold text-slate-900 text-sm leading-none">{maid.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={cn("w-3 h-3", star <= 4 ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center font-bold text-slate-600 text-xs">
                  48
                </TableCell>
                <TableCell>
                  <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px]">DISPONÍVEL</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-100 shadow-xl">
                      <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Opções</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer gap-2 font-semibold text-xs py-2.5">
                        <UserCircle className="w-4 h-4 text-indigo-500" /> Ver Histórico
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

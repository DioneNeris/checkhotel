"use client";

import { ChecklistItem } from "@prisma/client";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  CheckSquare, 
  Settings2,
  Trash2,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  GripVertical
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

export function ChecklistManagement({
  items,
}: {
  items: ChecklistItem[];
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">Protocolos de Vistoria</h2>
          <p className="text-xs text-slate-500 font-medium">Configuração dos requisitos técnicos de inspeção</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs gap-2">
              <ArrowUpDown className="w-3.5 h-3.5" /> Reordenar
           </Button>
           <Button className="rounded-xl font-bold text-xs gap-2 shadow-lg shadow-emerald-100 bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4" /> Novo Requisito
           </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative group max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
            <Input 
              placeholder="Buscar requisito..." 
              className="pl-10 h-10 bg-white border-slate-200 rounded-xl text-sm focus-visible:ring-emerald-100 transition-all"
            />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-16 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Ordem</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Descrição do Requisito</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Importância</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="text-right text-xs font-black uppercase tracking-widest text-slate-400">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id} className="group hover:bg-slate-50 transition-colors border-slate-50">
                <TableCell className="py-4">
                  <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-400 cursor-grab" />
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-bold text-slate-400 text-xs">#{index + 1}</span>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-slate-900 text-sm">{item.description}</span>
                </TableCell>
                <TableCell>
                  {item.required ? (
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 text-[10px] font-bold">OBRIGATÓRIO</Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-400 border-slate-200 text-[10px] font-bold">OPCIONAL</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Ativo</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600 transition-colors" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-100 shadow-xl">
                      <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Configurações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer gap-2 font-semibold text-xs py-2.5">
                        <Settings2 className="w-4 h-4 text-emerald-500" /> Editar Requisito
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

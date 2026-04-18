"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  UserCircle, 
  Shield, 
  Mail, 
  Power,
  Trash2,
  Calendar,
  Filter,
  ArrowUpDown,
  UserCheck,
  UserX
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function UserManagement({
  users: initialUsers,
}: {
  users: User[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(initialUsers);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN": return <Badge className="bg-blue-100 text-blue-700 border-none font-bold text-[10px]">ADMINISTRADOR</Badge>;
      case "RECEPTIONIST": return <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none font-bold text-[10px]">RECEPÇÃO</Badge>;
      case "MAID": return <Badge variant="outline" className="text-slate-500 font-bold text-[10px]">CAMAREIRA</Badge>;
      default: return <Badge variant="ghost" className="text-[10px]">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">Gestão de Colaboradores</h2>
          <p className="text-xs text-slate-500 font-medium">Controle de acesso e permissões do sistema</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs gap-2">
              <Filter className="w-3.5 h-3.5" /> Filtrar
           </Button>
           <Button className="rounded-xl font-bold text-xs gap-2 shadow-lg shadow-blue-100 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Novo Colaborador
           </Button>
        </div>
      </div>

      {/* Search and Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative group max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="Buscar por nome ou e-mail..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-white border-slate-200 rounded-xl text-sm focus-visible:ring-blue-100 transition-all"
            />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[300px] text-xs font-black uppercase tracking-widest text-slate-400">Colaborador</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Cargo / Permissão</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Cadastro</TableHead>
              <TableHead className="text-right text-xs font-black uppercase tracking-widest text-slate-400">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-400 font-medium italic">
                  Nenhum colaborador encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="group hover:bg-slate-50 transition-colors border-slate-50">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-xl border-2 border-white shadow-sm ring-1 ring-slate-100">
                        <AvatarFallback className="bg-blue-50 text-blue-600 font-black text-xs">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm leading-none">{user.name}</span>
                        <span className="text-[11px] text-slate-500 mt-1">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {user.active ? (
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Ativo</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <UserX className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold uppercase tracking-wider">Inativo</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 opacity-50" />
                      {format(new Date(user.createdAt), "dd MMM yyyy", { locale: ptBR })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 transition-colors" />}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-100 shadow-xl">
                        <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Opções</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2 font-semibold text-xs py-2.5">
                          <UserCircle className="w-4 h-4 text-blue-500" /> Editar Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 font-semibold text-xs py-2.5">
                          <Shield className="w-4 h-4 text-amber-500" /> Permissões
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2 font-semibold text-xs py-2.5 text-rose-500 focus:bg-rose-50 focus:text-rose-600">
                          <Power className="w-4 h-4" /> Desativar Acesso
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

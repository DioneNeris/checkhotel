"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  Shield, 
  UserCircle, 
  MoreHorizontal, 
  Loader2, 
  Trash2, 
  Key, 
  CheckCircle2, 
  XCircle,
  Mail,
  Calendar
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createUser, updateUser, deleteUser, resetUserPassword } from "@/app/actions/admin";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  active: boolean;
  createdAt: Date;
}

export function UserManagement({ initialUsers }: { initialUsers: User[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = initialUsers.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
        handleClose();
      } else {
        const result = await createUser(formData);
        if (result?.tempPassword) {
          setTempPassword(result.tempPassword);
        } else {
          handleClose();
        }
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar usuário");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetPassword(id: string) {
    setIsLoading(true);
    try {
      const result = await resetUserPassword(id);
      if (result?.tempPassword) {
        setTempPassword(result.tempPassword);
      }
    } catch (error) {
      alert("Erro ao resetar senha");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Deseja inativar este usuário? O histórico será preservado.")) {
      try {
        await deleteUser(id);
      } catch (error) {
        alert("Erro ao inativar usuário");
      }
    }
  }

  const handleClose = () => {
    setIsOpen(false);
    setEditingUser(null);
    setTempPassword(null);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setIsOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">Gestão de Usuários</h1>
          <p className="text-muted-foreground mt-1 font-medium">Controle de acessos e permissões da equipe.</p>
        </div>
        <Button 
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/10 px-6 h-12 rounded-xl font-bold"
        >
          <Plus data-icon="inline-start" />
          Novo Usuário
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome ou e-mail..." 
            className="pl-10 h-11 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-accent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="h-8 border-accent/20 text-accent font-bold">
            {filteredUsers.length} Usuários
           </Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="w-[300px] font-serif font-bold text-foreground">Usuário</TableHead>
              <TableHead className="font-serif font-bold text-foreground">Cargo</TableHead>
              <TableHead className="font-serif font-bold text-foreground">Status</TableHead>
              <TableHead className="font-serif font-bold text-foreground">Cadastrado em</TableHead>
              <TableHead className="text-right font-serif font-bold text-foreground">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    "group transition-colors hover:bg-accent/5",
                    !user.active && "opacity-60 grayscale-[0.5]"
                  )}
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-border/50 group-hover:border-accent/30 transition-colors">
                        <AvatarFallback className="bg-primary/5 text-primary font-bold">
                          {user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground group-hover:text-accent transition-colors">
                          {user.name}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="font-bold tracking-tight text-[10px] uppercase">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.active ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Ativo
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-xs uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                        Inativo
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(user.createdAt), "dd MMM yyyy", { locale: ptBR })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/10">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 shadow-xl">
                        <DropdownMenuLabel className="font-serif">Opções de Conta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEdit(user)} className="cursor-pointer gap-2">
                          <UserCircle className="w-4 h-4 text-primary" />
                          Editar Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(user.id)} className="cursor-pointer gap-2 text-amber-600 focus:text-amber-700">
                          <Key className="w-4 h-4" />
                          Resetar Senha
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.active && (
                          <DropdownMenuItem onClick={() => handleDelete(user.id)} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                            <XCircle className="w-4 h-4" />
                            Inativar Acesso
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground font-medium italic">Nenhum usuário encontrado para sua busca.</p>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-border/50 shadow-2xl overflow-hidden p-0">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent/20 via-accent to-accent/20" />
          
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-serif">
              {tempPassword ? "Registro Concluído" : editingUser ? "Refinar Perfil" : "Novo Membro da Equipe"}
            </DialogTitle>
            <DialogDescription>
              {tempPassword 
                ? "As credenciais de acesso foram geradas com sucesso." 
                : "Preencha os detalhes abaixo para gerenciar as permissões."}
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 pt-0">
            {tempPassword ? (
              <div className="space-y-6">
                <div className="bg-primary/5 p-6 rounded-2xl border border-accent/20 flex flex-col items-center gap-4">
                  <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Senha Temporária</span>
                  <div className="text-3xl font-mono font-bold tracking-[0.2em] text-foreground">
                    {tempPassword}
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-xs text-amber-700 leading-relaxed font-medium">
                  <strong>Atenção:</strong> Esta senha não será exibida novamente. O sistema exigirá a troca imediata no primeiro acesso do usuário.
                </div>
                <Button 
                  onClick={handleClose}
                  className="w-full h-12 rounded-xl bg-foreground text-background font-bold"
                >
                  Entendido
                </Button>
              </div>
            ) : (
              <form action={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nome Completo</label>
                  <Input 
                    name="name"
                    required
                    defaultValue={editingUser?.name || ""}
                    placeholder="Ex: Alexandre de Moraes"
                    className="h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-accent rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">E-mail Corporativo</label>
                  <Input 
                    name="email"
                    type="email"
                    required
                    defaultValue={editingUser?.email || ""}
                    placeholder="email@checkhotel.com"
                    className="h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-accent rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nível de Acesso</label>
                    <select 
                      name="role"
                      required
                      defaultValue={editingUser?.role || "RECEPTIONIST"}
                      className="w-full h-12 bg-muted/30 border-none focus:ring-1 focus:ring-accent rounded-xl px-3 text-sm font-medium appearance-none"
                    >
                      <option value="RECEPTIONIST">Recepcionista</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Estado da Conta</label>
                    <select 
                      name="active"
                      required
                      defaultValue={editingUser ? String(editingUser.active) : "true"}
                      className="w-full h-12 bg-muted/30 border-none focus:ring-1 focus:ring-accent rounded-xl px-3 text-sm font-medium appearance-none"
                    >
                      <option value="true">Ativo</option>
                      <option value="false">Inativo</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl font-bold text-md shadow-lg shadow-primary/10"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      editingUser ? "Atualizar Cadastro" : "Criar Novo Usuário"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Persistent Password Alert for resets outside the modal flow */}
      <AnimatePresence>
        {tempPassword && !isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-border/50 text-center space-y-6 relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
               <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto">
                <Key className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold">Nova Senha</h2>
                <p className="text-sm text-muted-foreground mt-2 font-medium">Credencial gerada para o usuário:</p>
              </div>
              <div className="bg-muted/50 p-6 rounded-2xl font-mono text-3xl font-bold tracking-[0.3em] text-foreground border border-border/30">
                {tempPassword}
              </div>
              <Button 
                onClick={() => setTempPassword(null)}
                className="w-full h-12 rounded-xl font-bold"
              >
                Concluído
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

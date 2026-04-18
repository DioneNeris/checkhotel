"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  UserCircle, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Trash2,
  MoreHorizontal,
  Star
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
import { createMaid, updateMaid, deleteMaid } from "@/app/actions/admin";
import { motion, AnimatePresence } from "framer-motion";

interface Maid {
  id: string;
  name: string;
  active: boolean;
}

export function MaidManagement({ initialMaids }: { initialMaids: Maid[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMaid, setEditingMaid] = useState<Maid | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMaids = initialMaids.filter(maid => 
    maid.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      if (editingMaid) {
        await updateMaid(editingMaid.id, formData);
      } else {
        await createMaid(formData);
      }
      handleClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar camareira");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja remover esta camareira?")) {
      try {
        await deleteMaid(id);
      } catch (error) {
        alert("Erro ao excluir");
      }
    }
  }

  const handleClose = () => {
    setIsOpen(false);
    setEditingMaid(null);
  };

  const openEdit = (maid: Maid) => {
    setEditingMaid(maid);
    setIsOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">Equipe de Limpeza</h1>
          <p className="text-muted-foreground mt-1 font-medium">Gestão de camareiras e status de disponibilidade.</p>
        </div>
        <Button 
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/10 px-6 h-12 rounded-xl font-bold"
        >
          <Plus data-icon="inline-start" />
          Nova Camareira
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar camareira..." 
            className="pl-10 h-11 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-accent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="h-8 border-accent/20 text-accent font-bold">
            {filteredMaids.length} Colaboradoras
           </Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="w-[350px] font-serif font-bold text-foreground">Camareira</TableHead>
              <TableHead className="font-serif font-bold text-foreground">Disponibilidade</TableHead>
              <TableHead className="font-serif font-bold text-foreground">Performance</TableHead>
              <TableHead className="text-right font-serif font-bold text-foreground">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filteredMaids.map((maid, index) => (
                <motion.tr
                  key={maid.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    "group transition-colors hover:bg-accent/5",
                    !maid.active && "opacity-60 grayscale-[0.5]"
                  )}
                >
                  <TableCell className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/5 text-primary group-hover:bg-accent/10 group-hover:text-accent transition-all duration-300">
                        <UserCircle className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground group-hover:text-accent transition-colors">
                          {maid.name}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                          Identificação: {maid.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {maid.active ? (
                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 transition-colors font-bold gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Ativa no Turno
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="font-bold gap-1">
                        <XCircle className="w-3 h-3" />
                        Inativa
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={cn("w-3 h-3", s <= 4 ? "text-accent fill-accent" : "text-muted-foreground/30")} />
                      ))}
                      <span className="ml-2 text-[10px] font-bold text-muted-foreground">4.0</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/10" />}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 shadow-xl">
                        <DropdownMenuLabel className="font-serif">Opções</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEdit(maid)} className="cursor-pointer gap-2">
                          <UserCircle className="w-4 h-4 text-primary" />
                          Editar Perfil
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(maid.id)} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                          <Trash2 className="w-4 h-4" />
                          Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        {filteredMaids.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground font-medium italic">Nenhuma colaboradora encontrada.</p>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-border/50 shadow-2xl overflow-hidden p-0">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent/20 via-accent to-accent/20" />
          
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-serif">
              {editingMaid ? "Refinar Registro" : "Nova Colaboradora"}
            </DialogTitle>
            <DialogDescription>
              Cadastre as camareiras para atrelar às vistorias de quartos.
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 pt-0">
            <form action={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nome da Camareira</label>
                <Input 
                  name="name"
                  required
                  defaultValue={editingMaid?.name || ""}
                  placeholder="Ex: Maria das Graças"
                  className="h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-accent rounded-xl"
                />
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl border border-border/30">
                <input 
                  type="checkbox" 
                  name="active" 
                  id="active" 
                  value="true"
                  defaultChecked={editingMaid ? editingMaid.active : true} 
                  className="w-5 h-5 rounded border-border bg-background text-accent focus:ring-accent"
                />
                <label htmlFor="active" className="text-sm font-semibold text-foreground">Disponível para vistorias no turno atual?</label>
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
                      Processando...
                    </>
                  ) : (
                    editingMaid ? "Salvar Alterações" : "Confirmar Cadastro"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

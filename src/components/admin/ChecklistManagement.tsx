"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  CheckSquare, 
  MoreHorizontal, 
  GripVertical, 
  Settings2, 
  Loader2, 
  Trash2,
  CheckCircle2,
  PauseCircle,
  Hash
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
import { createChecklistItem, updateChecklistItem, deleteChecklistItem } from "@/app/actions/admin";
import { motion, AnimatePresence } from "framer-motion";

interface ChecklistItem {
  id: string;
  description: string;
  isActive: boolean;
  order: number;
}

export function ChecklistManagement({ initialItems }: { initialItems: ChecklistItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = initialItems.filter(item => 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.order - b.order);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      if (editingItem) {
        await updateChecklistItem(editingItem.id, formData);
      } else {
        await createChecklistItem(formData);
      }
      handleClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar item");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este item do checklist?")) {
      try {
        await deleteChecklistItem(id);
      } catch (error) {
        alert("Erro ao excluir");
      }
    }
  }

  const handleClose = () => {
    setIsOpen(false);
    setEditingItem(null);
  };

  const openEdit = (item: ChecklistItem) => {
    setEditingItem(item);
    setIsOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">Checklist de Vistoria</h1>
          <p className="text-muted-foreground mt-1 font-medium">Definição dos padrões de qualidade para inspeção.</p>
        </div>
        <Button 
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/10 px-6 h-12 rounded-xl font-bold"
        >
          <Plus data-icon="inline-start" />
          Adicionar Requisito
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Filtrar requisitos..." 
            className="pl-10 h-11 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-accent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="h-8 border-accent/20 text-accent font-bold">
            {filteredItems.length} Itens de Controle
           </Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="w-[80px] font-serif font-bold text-foreground">Ordem</TableHead>
              <TableHead className="font-serif font-bold text-foreground">Descrição do Requisito</TableHead>
              <TableHead className="font-serif font-bold text-foreground">Status</TableHead>
              <TableHead className="text-right font-serif font-bold text-foreground">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={cn(
                    "group transition-colors hover:bg-accent/5",
                    !item.isActive && "opacity-50 grayscale"
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <GripVertical className="w-3 h-3 text-muted-foreground/30 group-hover:text-accent/50 transition-colors cursor-grab" />
                       <span className="font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                        #{item.order}
                       </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <span className="font-bold text-foreground group-hover:text-accent transition-colors block max-w-xl">
                      {item.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    {item.isActive ? (
                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="font-bold gap-1">
                        <PauseCircle className="w-3 h-3" />
                        Pausado
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/10" />}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 shadow-xl">
                        <DropdownMenuLabel className="font-serif">Configurações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEdit(item)} className="cursor-pointer gap-2">
                          <Settings2 className="w-4 h-4 text-primary" />
                          Editar Requisito
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(item.id)} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        {filteredItems.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground font-medium italic">Nenhum requisito configurado.</p>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-border/50 shadow-2xl overflow-hidden p-0">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent/20 via-accent to-accent/20" />
          
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-serif">
              {editingItem ? "Refinar Requisito" : "Novo Requisito de Qualidade"}
            </DialogTitle>
            <DialogDescription>
              Itens do checklist garantem a padronização do atendimento hoteleiro.
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 pt-0">
            <form action={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Descrição Detalhada</label>
                <Input 
                  name="description"
                  required
                  defaultValue={editingItem?.description || ""}
                  placeholder="Ex: Verificar se as toalhas estão dobradas em 'cisne'"
                  className="h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-accent rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Ordem na Lista</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                    <Input 
                      name="order"
                      type="number"
                      required
                      defaultValue={editingItem?.order || initialItems.length + 1}
                      className="h-12 pl-8 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-accent rounded-xl font-mono"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Disponibilidade</label>
                   <div className="flex items-center h-12 gap-3 px-4 bg-muted/20 rounded-xl border border-border/30">
                    <input 
                      type="checkbox" 
                      name="isActive" 
                      id="isActive" 
                      value="true"
                      defaultChecked={editingItem ? editingItem.isActive : true} 
                      className="w-5 h-5 rounded border-border bg-background text-accent focus:ring-accent"
                    />
                    <label htmlFor="isActive" className="text-sm font-semibold text-foreground">Ativo</label>
                  </div>
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
                      Gravando...
                    </>
                  ) : (
                    editingItem ? "Salvar Alterações" : "Adicionar ao Checklist"
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

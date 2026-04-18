"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  Hotel, 
  MoreHorizontal, 
  DoorOpen, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Trash2,
  Bed,
  CalendarClock
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
import { createRoom, updateRoom, deleteRoom } from "@/app/actions/admin";
import { motion, AnimatePresence } from "framer-motion";

interface Room {
  id: string;
  number: string;
  status: string;
}

export function RoomManagement({ initialRooms }: { initialRooms: Room[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = initialRooms.filter(room => 
    room.number.includes(searchQuery)
  ).sort((a, b) => a.number.localeCompare(b.number));

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, formData);
      } else {
        await createRoom(formData);
      }
      handleClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar quarto");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Deseja realmente excluir este quarto? Todas as vistorias vinculadas podem ser afetadas.")) {
      try {
        await deleteRoom(id);
      } catch (error) {
        alert("Erro ao excluir");
      }
    }
  }

  const handleClose = () => {
    setIsOpen(false);
    setEditingRoom(null);
  };

  const openEdit = (room: Room) => {
    setEditingRoom(room);
    setIsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "FREE":
        return (
          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Livre
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-50 text-amber-600 border-amber-100 font-bold gap-1">
            <CalendarClock className="w-3 h-3" />
            Pendente
          </Badge>
        );
      case "NO_ACCESS":
        return (
          <Badge className="bg-rose-50 text-rose-600 border-rose-100 font-bold gap-1">
            <AlertCircle className="w-3 h-3" />
            Sem Acesso
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="font-bold">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground tracking-tight">Gestão de Unidades</h1>
          <p className="text-muted-foreground mt-1 font-medium">Controle de quartos e status de governança.</p>
        </div>
        <Button 
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/10 px-6 h-12 rounded-xl font-bold"
        >
          <Plus data-icon="inline-start" />
          Adicionar Quarto
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Filtrar por número..." 
            className="pl-10 h-11 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-accent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="h-8 border-accent/20 text-accent font-bold">
            {filteredRooms.length} Unidades Cadastradas
           </Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="w-[150px] font-serif font-bold text-foreground">Quarto</TableHead>
              <TableHead className="font-serif font-bold text-foreground">Status Atual</TableHead>
              <TableHead className="font-serif font-bold text-foreground">Última Vistoria</TableHead>
              <TableHead className="text-right font-serif font-bold text-foreground">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filteredRooms.map((room, index) => (
                <motion.tr
                  key={room.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="group transition-colors hover:bg-accent/5"
                >
                  <TableCell className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-muted/50 text-foreground group-hover:bg-accent/10 group-hover:text-accent transition-all duration-300">
                        <Bed className="h-5 w-5" />
                      </div>
                      <span className="text-2xl font-serif font-black tracking-tight text-foreground group-hover:text-accent transition-colors">
                        {room.number}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(room.status)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs font-medium">
                    <span className="bg-muted/30 px-2 py-1 rounded">Hoje, 14:30</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/10" />}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 shadow-xl">
                        <DropdownMenuLabel className="font-serif">Gestão de Unidade</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEdit(room)} className="cursor-pointer gap-2">
                          <DoorOpen className="w-4 h-4 text-primary" />
                          Editar Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(room.id)} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                          <Trash2 className="w-4 h-4" />
                          Excluir Quarto
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        {filteredRooms.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground font-medium italic">Nenhuma unidade encontrada.</p>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-border/50 shadow-2xl overflow-hidden p-0">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent/20 via-accent to-accent/20" />
          
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-serif">
              {editingRoom ? "Refinar Unidade" : "Nova Unidade Hoteleira"}
            </DialogTitle>
            <DialogDescription>
              Identifique o quarto para habilitar o fluxo de inspeção.
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 pt-0">
            <form action={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Número do Quarto</label>
                <div className="relative">
                  <Hotel className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    name="number"
                    required
                    defaultValue={editingRoom?.number || ""}
                    placeholder="Ex: 305"
                    className="h-14 pl-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-accent rounded-xl font-serif text-2xl font-black"
                  />
                </div>
              </div>

              {!editingRoom && (
                <div className="bg-accent/5 p-4 rounded-xl border border-accent/10">
                  <p className="text-[10px] text-accent font-bold uppercase tracking-widest leading-relaxed">
                    Nota: Novos quartos são inicializados com status &quot;Livre&quot; automaticamente.
                  </p>
                </div>
              )}

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
                    editingRoom ? "Salvar Alterações" : "Confirmar Cadastro"
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

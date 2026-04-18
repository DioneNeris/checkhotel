"use client";

import { useState } from "react";
import { Plus, Search, Hotel, MoreVertical, DoorOpen, AlertCircle, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { createRoom, updateRoom, deleteRoom } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

interface Room {
  id: string;
  number: string;
  status: string;
}

export function RoomManagement({ initialRooms }: { initialRooms: Room[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

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

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "FREE":
        return { label: "Livre", color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: CheckCircle2 };
      case "PENDING":
        return { label: "Pendente", color: "bg-amber-50 text-amber-600 border-amber-100", icon: AlertCircle };
      case "NO_ACCESS":
        return { label: "Sem Acesso", color: "bg-rose-50 text-rose-600 border-rose-100", icon: AlertCircle };
      default:
        return { label: status, color: "bg-slate-50 text-slate-600 border-slate-100", icon: DoorOpen };
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestão de Quartos</h1>
          <p className="text-slate-500 mt-1">Controle total de status e vistorias por unidade.</p>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Adicionar Quarto
        </button>
      </div>

      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center px-4">
        <Search className="w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Filtrar por número do quarto..." 
          className="w-full p-3 text-sm focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {initialRooms.map((room) => {
          const status = getStatusInfo(room.status);

          return (
            <div 
              key={room.id} 
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="flex justify-between w-full -mt-2 -mr-2 px-1">
                <button 
                  onClick={() => handleDelete(room.id)}
                  className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => openEdit(room)}
                  className="p-1 text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 flex items-center justify-center mb-3 transition-colors">
                <Hotel className="w-6 h-6" />
              </div>

              <h3 className="font-black text-2xl text-slate-900 mb-1">{room.number}</h3>
              
              <div className={cn(
                "mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                status.color
              )}>
                {status.label}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isOpen} onClose={handleClose} title={editingRoom ? "Editar Quarto" : "Adicionar Novo Quarto"}>
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Número da Unidade</label>
              <input 
                name="number"
                required
                defaultValue={editingRoom?.number || ""}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-xl"
                placeholder="Ex: 101"
              />
              {!editingRoom && (
                <p className="mt-2 text-xs text-slate-400 italic">O quarto será criado com o status "Livre" por padrão.</p>
              )}
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading ? "Salvando..." : editingRoom ? "Salvar Alterações" : "Cadastrar Quarto"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

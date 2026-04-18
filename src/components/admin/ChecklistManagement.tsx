"use client";

import { useState } from "react";
import { Plus, Search, CheckSquare, MoreVertical, GripVertical, Settings2, Loader2, Trash2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { createChecklistItem, updateChecklistItem, deleteChecklistItem } from "@/app/actions/admin";

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
    if (confirm("Tem certeza que deseja excluir este item do checklist? Isso não afetará vistorias já realizadas.")) {
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checklist de Vistoria</h1>
          <p className="text-slate-500 mt-1">Configure os itens que devem ser validados em cada quarto.</p>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Adicionar Item
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Itens Ativos ({initialItems.length})</span>
          <Settings2 className="w-4 h-4 text-slate-400" />
        </div>
        
        <div className="divide-y divide-slate-100">
          {initialItems.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-4 px-6 py-5 hover:bg-slate-50/30 transition-colors group"
            >
              <div className="cursor-grab text-slate-300 hover:text-slate-500">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {item.description}
                </h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${
                    item.isActive ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 bg-slate-50'
                  }`}>
                    {item.isActive ? 'Ativo' : 'Pausado'}
                  </span>
                  <span className="text-[10px] text-slate-300 font-medium">Ordem: #{item.order}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openEdit(item)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={handleClose} title={editingItem ? "Editar Item" : "Adicionar Item ao Checklist"}>
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Descrição do Item</label>
              <input 
                name="description"
                required
                defaultValue={editingItem?.description || ""}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="Ex: Verificar se o ar condicionado está gelando"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Ordem de Exibição</label>
              <input 
                name="order"
                type="number"
                required
                defaultValue={editingItem?.order || initialItems.length + 1}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            {editingItem && (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <input 
                  type="checkbox" 
                  name="isActive" 
                  id="isActive" 
                  value="true"
                  defaultChecked={editingItem.isActive} 
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-slate-700">Item está ativo?</label>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading ? "Salvando..." : editingItem ? "Salvar Alterações" : "Salvar Item"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

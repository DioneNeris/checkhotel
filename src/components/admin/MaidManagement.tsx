"use client";

import { useState } from "react";
import { Plus, Search, UserCircle, CheckCircle2, XCircle, Loader2, Trash2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { createMaid, updateMaid, deleteMaid } from "@/app/actions/admin";

interface Maid {
  id: string;
  name: string;
  active: boolean;
}

export function MaidManagement({ initialMaids }: { initialMaids: Maid[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMaid, setEditingMaid] = useState<Maid | null>(null);

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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Equipe de Limpeza</h1>
          <p className="text-slate-500 mt-1">Gerencie as camareiras responsáveis pelos quartos.</p>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Nova Camareira
        </button>
      </div>

      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center px-4">
        <Search className="w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Pesquisar camareira..." 
          className="w-full p-3 text-sm focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {initialMaids.map((maid) => (
          <div 
            key={maid.id} 
            className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <UserCircle className="w-10 h-10" />
              </div>
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl border ${
                  maid.active 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-500' 
                    : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}>
                  {maid.active ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <button 
                  onClick={() => handleDelete(maid.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h3 className="font-bold text-slate-900 text-lg mb-1">{maid.name}</h3>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
              {maid.active ? 'Ativa no Turno' : 'Inativa'}
            </p>

            <div className="grid grid-cols-1 pt-6 border-t border-slate-50">
              <button 
                onClick={() => openEdit(maid)}
                className="py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Editar Perfil
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={handleClose} title={editingMaid ? "Editar Camareira" : "Nova Camareira"}>
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nome da Camareira</label>
              <input 
                name="name"
                required
                defaultValue={editingMaid?.name || ""}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Ex: Maria Oliveira"
              />
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <input 
                type="checkbox" 
                name="active" 
                id="active" 
                value="true"
                defaultChecked={editingMaid ? editingMaid.active : true} 
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="active" className="text-sm font-bold text-slate-700">Pode realizar vistorias imediatamente?</label>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading ? "Salvando..." : editingMaid ? "Salvar Alterações" : "Cadastrar Camareira"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

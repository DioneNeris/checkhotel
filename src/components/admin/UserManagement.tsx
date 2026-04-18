"use client";

import { useState } from "react";
import { Plus, Search, Shield, UserCircle, MoreVertical, Loader2, Trash2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { createUser, updateUser, deleteUser } from "@/app/actions/admin";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: Date;
}

export function UserManagement({ initialUsers }: { initialUsers: User[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      handleClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar usuário");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await deleteUser(id);
      } catch (error) {
        alert("Erro ao excluir usuário");
      }
    }
  }

  const handleClose = () => {
    setIsOpen(false);
    setEditingUser(null);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setIsOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestão de Usuários</h1>
          <p className="text-slate-500 mt-1">Gerencie acessos de administradores e recepcionistas.</p>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Novo Usuário
        </button>
      </div>

      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center px-4">
        <Search className="w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Pesquisar por nome ou e-mail..." 
          className="w-full p-3 text-sm focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {initialUsers.map((user) => (
          <div 
            key={user.id} 
            className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                <UserCircle className="w-8 h-8" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                  user.role === 'ADMIN' 
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                    : 'bg-slate-50 text-slate-600 border-slate-100'
                }`}>
                  {user.role}
                </span>
                <button 
                  onClick={() => handleDelete(user.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-lg">{user.name}</h3>
              <p className="text-sm text-slate-500 truncate">{user.email}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Shield className="w-3.5 h-3.5" />
                Criado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </span>
              <button 
                onClick={() => openEdit(user)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Editar Perfil
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={handleClose} title={editingUser ? "Editar Usuário" : "Novo Usuário"}>
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
              <input 
                name="name"
                required
                defaultValue={editingUser?.name || ""}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Ex: João Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
              <input 
                name="email"
                type="email"
                required
                defaultValue={editingUser?.email || ""}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="joao@checkhotel.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Cargo / Acesso</label>
              <select 
                name="role"
                required
                defaultValue={editingUser?.role || "RECEPTIONIST"}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
              >
                <option value="RECEPTIONIST">Recepcionista</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading ? "Salvando..." : editingUser ? "Salvar Alterações" : "Criar Usuário"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

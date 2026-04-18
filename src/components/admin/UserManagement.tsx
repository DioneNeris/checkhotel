"use client";

import { useState } from "react";
import { Plus, Search, Shield, UserCircle, MoreVertical, Loader2, Trash2, Key, CheckCircle2, XCircle } from "lucide-react";
import { Modal } from "@/components/Modal";
import { createUser, updateUser, deleteUser, resetUserPassword } from "@/app/actions/admin";

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
          // Não fechamos o modal imediatamente para mostrar a senha, 
          // ou mostramos em um estado separado. Vamos usar um estado de "sucesso".
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
    if (confirm("Deseja gerar uma nova senha temporária para este usuário?")) {
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
            className={`group bg-white p-6 rounded-3xl border transition-all ${
              user.active ? 'border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100' : 'border-slate-100 opacity-75 grayscale-[0.5]'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${
                user.active ? 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500' : 'bg-slate-50 text-slate-300'
              }`}>
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
                {user.active ? (
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                    title="Inativar Usuário"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="p-1.5 text-rose-300">
                    <XCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">{user.name}</h3>
                {!user.active && <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded uppercase">Inativo</span>}
              </div>
              <p className="text-sm text-slate-500 truncate">{user.email}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between gap-2">
              <button 
                onClick={() => handleResetPassword(user.id)}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-2 rounded-xl transition-colors"
              >
                <Key className="w-3.5 h-3.5" />
                Resetar Senha
              </button>
              <button 
                onClick={() => openEdit(user)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-2"
              >
                Editar Perfil
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={handleClose} title={tempPassword ? "Usuário Criado!" : editingUser ? "Editar Usuário" : "Novo Usuário"}>
        {tempPassword ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Sucesso!</h2>
              <p className="text-slate-500 mt-2">O usuário foi cadastrado. Forneça a senha temporária abaixo:</p>
            </div>
            
            <div className="bg-slate-900 text-white p-6 rounded-3xl font-mono text-3xl tracking-widest shadow-2xl shadow-slate-900/20 relative group">
              {tempPassword}
            </div>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-left">
              <p className="text-xs text-amber-700 font-medium leading-relaxed">
                <strong>Importante:</strong> Esta senha não será exibida novamente. O usuário será solicitado a criar uma nova senha no primeiro acesso.
              </p>
            </div>

            <button 
              onClick={handleClose}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all"
            >
              Concluído
            </button>
          </div>
        ) : (
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
                <label className="block text-sm font-bold text-slate-700 mb-2">E-mail (Login)</label>
                <input 
                  name="email"
                  type="email"
                  required
                  defaultValue={editingUser?.email || ""}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="joao@checkhotel.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                  <select 
                    name="active"
                    required
                    defaultValue={editingUser ? String(editingUser.active) : "true"}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </div>
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
        )}
      </Modal>

      {/* Alerta separado para Reset de Senha (se o modal estiver fechado) */}
      {tempPassword && !isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center space-y-6 animate-in zoom-in duration-300">
             <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Key className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Nova Senha Gerada</h2>
              <p className="text-sm text-slate-500 mt-2">Senha temporária resetada com sucesso:</p>
            </div>
            <div className="bg-slate-100 p-4 rounded-2xl font-mono text-2xl font-bold tracking-widest text-slate-900">
              {tempPassword}
            </div>
            <button 
              onClick={() => setTempPassword(null)}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold"
            >
              Copiar e Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Lock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { changePassword } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function NewPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    try {
      await changePassword(formData);
      setIsSuccess(true);
      // Aguarda 2 segundos e redireciona ou faz logout para forçar novo login com a senha nova
      setTimeout(() => {
        signOut({ callbackUrl: "/login" });
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao alterar a senha.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-8 sm:p-12 space-y-8 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Lock className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nova Senha</h1>
          <p className="text-slate-500 text-sm">Para sua segurança, defina uma senha definitiva para seu primeiro acesso.</p>
        </div>

        {isSuccess ? (
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl text-center space-y-4 animate-in slide-in-from-bottom-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <div>
              <h3 className="font-bold text-emerald-900 text-lg">Senha Alterada!</h3>
              <p className="text-emerald-700 text-sm">Você será redirecionado para o login em instantes...</p>
            </div>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-700 text-sm animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Nova Senha</label>
                <input 
                  name="newPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Confirmar Senha</label>
                <input 
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? "Processando..." : "Definir Senha"}
            </button>
          </form>
        )}

        <div className="pt-4 text-center">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
            CheckHotel Security System
          </p>
        </div>
      </div>
    </div>
  );
}

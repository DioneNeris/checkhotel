"use client";

import { useEffect, useState } from "react";
import { db, LocalInspection } from "@/lib/db";
import { useSync } from "@/hooks/useSync";
import { AlertCircle, CheckCircle, Clock, Trash2, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function SyncCenter() {
  const [inspections, setInspections] = useState<LocalInspection[]>([]);
  const { syncData, isSyncing } = useSync();

  const loadData = async () => {
    const data = await db.inspections.orderBy('createdAt').reverse().toArray();
    setInspections(data);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const deleteInspection = async (localId: string) => {
    if (confirm("Tem certeza que deseja excluir este rascunho local?")) {
      await db.inspections.delete(localId);
      await db.photos.where('inspectionLocalId').equals(localId).delete();
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Centro de Sincronização</h1>
        <button 
          onClick={() => syncData()}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
        >
          <RefreshCw className={isSyncing ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
          Sincronizar Agora
        </button>
      </div>

      <div className="space-y-3">
        {inspections.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <CheckCircle className="w-12 h-12 text-emerald-100 mx-auto mb-3" />
            <p className="text-slate-500">Nenhuma vistoria local pendente.</p>
          </div>
        ) : (
          inspections.map((insp) => (
            <div key={insp.localId} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">Quarto {insp.roomId}</h3>
                  <p className="text-xs text-slate-500">
                    {format(insp.createdAt, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {insp.syncStatus === 'pending' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3" /> Pendente
                    </span>
                  )}
                  {insp.syncStatus === 'data_synced' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle className="w-3 h-3" /> Sincronizado
                    </span>
                  )}
                  {insp.syncStatus === 'error' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      <AlertCircle className="w-3 h-3" /> Erro
                    </span>
                  )}
                  {insp.syncStatus === 'expired' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3" /> Expirado
                    </span>
                  )}
                  
                  <button 
                    onClick={() => deleteInspection(insp.localId!)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="block text-slate-400 mb-0.5 uppercase">Status</span>
                  <span className="font-semibold text-slate-700">{insp.roomStatus}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="block text-slate-400 mb-0.5 uppercase">Itens</span>
                  <span className="font-semibold text-slate-700">{insp.items.length} itens</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

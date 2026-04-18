"use client";

import { useSync } from "@/hooks/useSync";
import { CloudOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncIndicator() {
  const { isSyncing, pendingCount } = useSync();

  if (pendingCount === 0 && !isSyncing) {
    return (
      <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border border-emerald-100">
        <CheckCircle2 className="w-3 h-3" />
        Sincronizado
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-colors",
        isSyncing 
          ? "bg-blue-50 text-blue-600 border-blue-100" 
          : "bg-amber-50 text-amber-600 border-amber-100"
      )}
    >
      {isSyncing ? (
        <RefreshCw className="w-3 h-3 animate-spin" />
      ) : (
        <CloudOff className="w-3 h-3" />
      )}
      <span>{isSyncing ? "Enviando" : `${pendingCount} Pendente${pendingCount > 1 ? 's' : ''}`}</span>
    </div>
  );
}

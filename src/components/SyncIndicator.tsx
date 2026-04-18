"use client";

import { useSync } from "@/hooks/useSync";
import { Cloud, CloudOff, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncIndicator() {
  const { isSyncing, pendingCount } = useSync();

  if (pendingCount === 0 && !isSyncing) {
    return (
      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-medium">
        <Cloud className="w-3.5 h-3.5" />
        Sincronizado
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors",
      isSyncing ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
    )}>
      {isSyncing ? (
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <CloudOff className="w-3.5 h-3.5" />
      )}
      <span>{isSyncing ? "Sincronizando..." : `${pendingCount} pendentes`}</span>
    </div>
  );
}

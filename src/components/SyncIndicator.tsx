"use client";

import { useSync } from "@/hooks/useSync";
import { Cloud, CloudOff, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function SyncIndicator() {
  const { isSyncing, pendingCount } = useSync();

  return (
    <AnimatePresence mode="wait">
      {pendingCount === 0 && !isSyncing ? (
        <motion.div 
          key="synced"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex items-center gap-1.5 text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20"
        >
          <CheckCircle2 className="w-3 h-3" />
          Sincronizado
        </motion.div>
      ) : (
        <motion.div 
          key="pending"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-colors",
            isSyncing 
              ? "bg-accent/10 text-accent border-accent/20" 
              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
          )}
        >
          {isSyncing ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : (
            <CloudOff className="w-3 h-3" />
          )}
          <span>{isSyncing ? "Sincronizando" : `${pendingCount} Pendente${pendingCount > 1 ? 's' : ''}`}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

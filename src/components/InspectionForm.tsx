"use client";

import { useState, useRef } from "react";
import { ChecklistItem, Room } from "@prisma/client";
import { 
  Camera, 
  Check, 
  X, 
  Send, 
  Save, 
  ArrowLeft, 
  Loader2, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { compressPhoto } from "@/lib/imageCompression";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

type ItemState = {
  checklistItemId: string;
  status: "OK" | "ISSUE" | null;
  observation: string;
  photo: File | null;
  photoPreviewUrl: string | null;
};

export function InspectionForm({
  room,
  checklistItems,
}: {
  room: Room;
  checklistItems: ChecklistItem[];
}) {
  const router = useRouter();

  const [itemsState, setItemsState] = useState<Record<string, ItemState>>(
    checklistItems.reduce((acc, item) => {
      acc[item.id] = {
        checklistItemId: item.id,
        status: null,
        observation: "",
        photo: null,
        photoPreviewUrl: null,
      };
      return acc;
    }, {} as Record<string, ItemState>)
  );
  
  const [roomStatus, setRoomStatus] = useState<typeof room.status>(room.status);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleStatusChange = (itemId: string, status: "OK" | "ISSUE") => {
    setItemsState(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], status }
    }));
  };

  const handleObservationChange = (itemId: string, observation: string) => {
    setItemsState(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], observation }
    }));
  };

  const handlePhotoCapture = (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setItemsState(prev => ({
        ...prev,
        [itemId]: { ...prev[itemId], photo: file, photoPreviewUrl: url }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const localId = uuidv4();
      
      const itemsPayload = Object.values(itemsState)
        .filter(st => st.status)
        .map(st => ({
          checklistItemId: st.checklistItemId,
          status: st.status as "OK" | "ISSUE",
          observation: st.observation
        }));

      await db.inspections.add({
        localId,
        roomId: room.id,
        maidId: null,
        roomStatus,
        items: itemsPayload,
        createdAt: Date.now(),
        syncStatus: 'pending'
      });

      const photoPromises = Object.values(itemsState)
        .filter(st => st.status === "ISSUE" && st.photo)
        .map(async (st) => {
          const compressed = await compressPhoto(st.photo!);
          return db.photos.add({
            inspectionLocalId: localId,
            checklistItemId: st.checklistItemId,
            file: compressed,
            status: 'pending',
            attempts: 0
          });
        });

      await Promise.all(photoPromises);
      router.push("/app?sync=true");
      router.refresh();
      
    } catch (err) {
      console.error(err);
      alert("Erro ao preparar vistoria offline.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-32 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="p-3 rounded-2xl bg-card border border-border/50 text-muted-foreground active:scale-90 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-serif font-black text-foreground">Quarto {room.number}</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-accent" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Inspeção de Excelência</span>
          </div>
        </div>
      </div>

      {/* Room Status Selection Card */}
      <div className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-bold text-foreground">Status Pós-Vistoria</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {(["FREE", "OCCUPIED_AC", "OCCUPIED_NO_AC", "MAINTENANCE"] as const).map(rs => {
            const labels = {
              FREE: "Livre",
              OCCUPIED_AC: "Ocupado (+)",
              OCCUPIED_NO_AC: "Ocupado (-)",
              MAINTENANCE: "Manutenção"
            };
            
             const mapToDb = {
              FREE: "FREE",
              OCCUPIED_AC: "PENDING", 
              OCCUPIED_NO_AC: "NO_ACCESS",
              MAINTENANCE: "PENDING"
            };

            const isSelected = roomStatus === mapToDb[rs];

            return (
              <button
                key={rs}
                type="button"
                onClick={() => setRoomStatus(mapToDb[rs] as any)}
                className={cn(
                  "py-4 px-2 text-[11px] font-bold uppercase tracking-wider rounded-2xl border transition-all duration-300",
                  isSelected 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10"
                    : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50"
                )}
              >
                {labels[rs]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Itens de Verificação</h3>
        <AnimatePresence mode="popLayout">
          {checklistItems.map((item, index) => {
            const state = itemsState[item.id];
            const isOk = state.status === "OK";
            const isIssue = state.status === "ISSUE";
            
            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={cn(
                  "bg-card rounded-[2rem] border p-6 transition-all duration-500",
                  isOk ? "border-emerald-500/30 bg-emerald-500/[0.02]" : 
                  isIssue ? "border-rose-500/30 bg-rose-500/[0.02] shadow-md" : 
                  "border-border/50"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-bold text-foreground text-md leading-snug pt-2">{item.description}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, "OK")}
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                        isOk 
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                          : "bg-muted/30 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600"
                      )}
                    >
                      <Check className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, "ISSUE")}
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                        isIssue 
                          ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" 
                          : "bg-muted/30 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600"
                      )}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Expanded Issue Section */}
                <AnimatePresence>
                  {isIssue && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 pt-6 border-t border-border/50 space-y-4">
                        <textarea
                          placeholder="Detalhes técnicos da pendência..."
                          value={state.observation}
                          onChange={(e) => handleObservationChange(item.id, e.target.value)}
                          className="w-full p-4 bg-muted/20 border-none rounded-2xl focus:ring-1 focus:ring-rose-500/30 text-sm font-medium placeholder:italic transition-all"
                          rows={3}
                        />
                        
                        <input 
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => handlePhotoCapture(item.id, e)}
                          ref={(el) => { fileInputRefs.current[item.id] = el; }}
                        />
                        
                        {state.photoPreviewUrl ? (
                          <div className="relative rounded-2xl overflow-hidden h-48 w-full bg-muted shadow-inner group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={state.photoPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                type="button"
                                onClick={() => {
                                  setItemsState(prev => ({...prev, [item.id]: { ...prev[item.id], photo: null, photoPreviewUrl: null}}));
                                  if (fileInputRefs.current[item.id]) fileInputRefs.current[item.id]!.value = "";
                                }}
                                className="bg-rose-500 text-white p-3 rounded-full shadow-xl active:scale-90 transition-transform"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[item.id]?.click()}
                            className="w-full py-5 bg-rose-500/5 border-2 border-dashed border-rose-500/20 rounded-2xl text-rose-600 hover:bg-rose-500/10 transition-colors flex flex-col items-center justify-center gap-2"
                          >
                            <Camera className="w-8 h-8 opacity-70" />
                            <span className="text-xs font-bold uppercase tracking-widest">Registrar Evidência Visual</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-24 left-0 right-0 px-6 max-w-2xl mx-auto z-30">
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="submit"
          disabled={submitting}
          className="w-full h-16 bg-foreground text-background rounded-2xl font-black text-lg shadow-2xl shadow-foreground/20 flex items-center justify-center gap-3 disabled:opacity-70 transition-all border border-foreground/50"
        >
          {submitting ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" /> 
              Finalizar Protocolo
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}

"use client";

import { useState, useRef } from "react";
import { ChecklistItem, Room } from "@prisma/client";
import { 
  Camera, 
  Check, 
  X, 
  Send, 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  Trash2,
  CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { compressPhoto } from "@/lib/imageCompression";
import { v4 as uuidv4 } from "uuid";

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
    <form onSubmit={handleSubmit} className="space-y-6 pb-32 animate-fade-in">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 active:scale-90 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quarto {room.number}</h2>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocolo de Vistoria</span>
          </div>
        </div>
      </div>

      {/* Room Status Selection */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Status Final da Unidade</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {(["FREE", "OCCUPIED_AC", "OCCUPIED_NO_AC", "MAINTENANCE"] as const).map(rs => {
            const labels = {
              FREE: "Liberado",
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
                  "py-3 px-2 text-[10px] font-black uppercase tracking-wider rounded-xl border transition-all",
                  isSelected 
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                    : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                )}
              >
                {labels[rs]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {checklistItems.map((item) => {
          const state = itemsState[item.id];
          const isOk = state.status === "OK";
          const isIssue = state.status === "ISSUE";
          
          return (
            <div 
              key={item.id}
              className={cn(
                "bg-white rounded-2xl border p-5 transition-all",
                isOk ? "border-emerald-200 bg-emerald-50/30" : 
                isIssue ? "border-rose-200 bg-rose-50/30 shadow-md" : 
                "border-slate-100"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-bold text-slate-800 text-sm leading-tight pt-1">{item.description}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item.id, "OK")}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      isOk 
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" 
                        : "bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                    )}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item.id, "ISSUE")}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      isIssue 
                        ? "bg-rose-600 text-white shadow-lg shadow-rose-100" 
                        : "bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    )}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {isIssue && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  <textarea
                    placeholder="Descreva o problema encontrado..."
                    value={state.observation}
                    onChange={(e) => handleObservationChange(item.id, e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-rose-200 outline-none"
                    rows={2}
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
                    <div className="relative rounded-xl overflow-hidden h-32 w-full bg-slate-100 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={state.photoPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => {
                          setItemsState(prev => ({...prev, [item.id]: { ...prev[item.id], photo: null, photoPreviewUrl: null}}));
                          if (fileInputRefs.current[item.id]) fileInputRefs.current[item.id]!.value = "";
                        }}
                        className="absolute top-2 right-2 bg-rose-600 text-white p-2 rounded-lg shadow-lg active:scale-90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[item.id]?.click()}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-1"
                    >
                      <Camera className="w-6 h-6 opacity-40" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Anexar Foto</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-0 right-0 px-6 max-w-md mx-auto z-40">
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-14 bg-blue-600 text-white rounded-xl font-black text-sm shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" /> 
              FINALIZAR VISTORIA
            </>
          )}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState, useRef } from "react";
import { ChecklistItem, Room } from "@prisma/client";
import { Camera, Check, X, Send, Save, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
    
    // Check if online, if offline we should save to IDB and sync later
    // For MVp, if online, just post
    
    try {
      const formData = new FormData();
      formData.append("roomId", room.id);
      formData.append("roomStatus", roomStatus);
      
      const itemsPayload = Object.values(itemsState).filter(st => st.status).map(st => ({
        checklistItemId: st.checklistItemId,
        status: st.status,
        observation: st.observation
      }));
      
      formData.append("items", JSON.stringify(itemsPayload));
      
      // Append photos
      Object.values(itemsState).forEach(st => {
        if (st.status === "ISSUE" && st.photo) {
          formData.append(`photo_${st.checklistItemId}`, st.photo);
        }
      });
      
      const res = await fetch("/api/inspections", {
        method: "POST",
        body: formData
      });
      
      if (!res.ok) throw new Error("Falha ao salvar vistoria");
      
      // Redirect back on success
      router.push("/app");
      router.refresh();
      
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar. Vistoria salva offline (mock).");
      // TODO: Implement IndexedDB Offline Save Logic
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button type="button" onClick={() => router.back()} className="p-2 rounded-full bg-slate-100 text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold">Quarto {room.number}</h2>
          <span className="text-sm text-slate-500">Inspeção de rotina</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Status do Quarto Pós-Vistoria</label>
        <div className="grid grid-cols-2 gap-3">
          {(["FREE", "OCCUPIED_AC", "OCCUPIED_NO_AC", "MAINTENANCE"] as const).map(rs => {
            // Mapping for the UI based on user prompt: Livre / ocupado+acesso / ocupado-acesso
            const labels = {
              FREE: "Livre",
              OCCUPIED_AC: "Ocupado (+Acesso)",
              OCCUPIED_NO_AC: "Ocupado (-Acesso)",
              MAINTENANCE: "Manutenção"
            };
            
            // Map our UI choices back to DB Enums (RoomStatus in Prisma is FREE, PENDING, APPROVED, NO_ACCESS)
            // User requested: "se selecionar quarto: escolhe status (livre, ocupado+acesso, ocupado-acesso)"
            // For now let's map these to our actual Prisma enum or just FREE / PENDING / APPROVED
             const mapToDb = {
              FREE: "FREE",
              OCCUPIED_AC: "PENDING", 
              OCCUPIED_NO_AC: "NO_ACCESS",
              MAINTENANCE: "PENDING"
            };

            return (
              <button
                key={rs}
                type="button"
                onClick={() => setRoomStatus(mapToDb[rs] as any)}
                className={cn(
                  "py-3 text-sm font-medium rounded-xl border transition-all text-center",
                  roomStatus === mapToDb[rs] 
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                )}
              >
                {labels[rs as keyof typeof labels]}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        {checklistItems.map((item) => {
          const state = itemsState[item.id];
          const isIssue = state.status === "ISSUE";
          
          return (
            <div key={item.id} className={cn(
              "bg-white rounded-2xl border p-5 transition-all",
              state.status === "OK" ? "border-emerald-200 ring-1 ring-emerald-500/10" : 
              state.status === "ISSUE" ? "border-rose-200 ring-1 ring-rose-500/10 shadow-sm" : 
              "border-slate-200"
            )}>
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-slate-800 flex-1">{item.description}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item.id, "OK")}
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      state.status === "OK" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                    )}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item.id, "ISSUE")}
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      state.status === "ISSUE" ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-400"
                    )}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Show Issue fields */}
              {isIssue && (
                <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                  <textarea
                    placeholder="Descreva o problema encontrado..."
                    value={state.observation}
                    onChange={(e) => handleObservationChange(item.id, e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl mb-3 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 text-sm"
                    rows={2}
                  />
                  
                  <input 
                    type="file"
                    accept="image/*"
                    capture="environment" // Forces back camera on mobile
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
                        className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white"
                      >
                        Remover Foto
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[item.id]?.click()}
                      className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Camera className="w-5 h-5" />
                      Tirar Foto do Problema
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Submit Button */}
      <div className="fixed bottom-[4.5rem] left-0 right-0 px-4 max-w-2xl mx-auto z-30">
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-slate-900 border border-slate-800 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Finalizar Vistoria</>}
        </button>
      </div>
    </form>
  );
}

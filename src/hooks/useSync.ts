import { useEffect, useCallback, useState } from 'react';
import { db, LocalInspection, LocalPhoto } from '@/lib/db';
import { isToday } from 'date-fns';

export function useSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const updateCounts = useCallback(async () => {
    const countInspections = await db.inspections.where('syncStatus').equals('pending').count();
    const countPhotos = await db.photos.where('status').equals('pending').count();
    setPendingCount(countInspections + countPhotos);
  }, []);

  const syncData = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      // 1. Sincronizar Inspeções (Dados)
      const pendingInspections = await db.inspections
        .where('syncStatus')
        .equals('pending')
        .toArray();

      for (const inspection of pendingInspections) {
        // Validar regra de data atual
        if (!isToday(inspection.createdAt)) {
          await db.inspections.update(inspection.localId!, { syncStatus: 'expired' });
          continue;
        }

        try {
          const res = await fetch('/api/inspections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...inspection,
              localId: inspection.localId
            }),
          });

          if (res.ok) {
            const data = await res.json();
            await db.inspections.update(inspection.localId!, {
              syncStatus: 'data_synced',
              serverId: data.inspectionId
            });
          } else {
            // Se o erro for "já existe", o servidor deve retornar o ID existente
            const data = await res.json();
            if (data.existingId) {
              await db.inspections.update(inspection.localId!, {
                syncStatus: 'data_synced',
                serverId: data.existingId
              });
            }
          }
        } catch (error) {
          console.error('Falha ao sincronizar dados da vistoria:', error);
        }
      }

      // 2. Sincronizar Fotos
      const readyForPhotos = await db.inspections
        .where('syncStatus')
        .equals('data_synced')
        .toArray();

      for (const inspection of readyForPhotos) {
        const pendingPhotos = await db.photos
          .where('inspectionLocalId')
          .equals(inspection.localId!)
          .and(p => p.status === 'pending')
          .toArray();

        for (const photo of pendingPhotos) {
          try {
            const formData = new FormData();
            formData.append('file', photo.file);
            formData.append('checklistItemId', photo.checklistItemId);

            const res = await fetch(`/api/inspections/${inspection.serverId}/photos`, {
              method: 'POST',
              body: formData,
            });

            if (res.ok) {
              await db.photos.delete(photo.id!);
            } else {
              const attempts = (photo.attempts || 0) + 1;
              if (attempts >= 3) {
                await db.photos.update(photo.id!, { status: 'error', attempts });
              } else {
                await db.photos.update(photo.id!, { attempts });
              }
            }
          } catch (error) {
            console.error('Falha ao subir foto:', error);
          }
        }
      }

      // Limpeza: Deletar inspeções sincronizadas com mais de 24h
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      await db.inspections
        .where('createdAt')
        .below(oneDayAgo)
        .and(i => i.syncStatus === 'data_synced')
        .delete();

    } finally {
      setIsSyncing(false);
      await updateCounts();
    }
  }, [isSyncing, updateCounts]);

  useEffect(() => {
    updateCounts();
    
    // Tenta sincronizar quando o app volta a ficar online
    window.addEventListener('online', syncData);
    
    // Intervalo de segurança a cada 1 minuto
    const interval = setInterval(syncData, 60000);
    
    return () => {
      window.removeEventListener('online', syncData);
      clearInterval(interval);
    };
  }, [syncData, updateCounts]);

  return { isSyncing, pendingCount, syncData };
}

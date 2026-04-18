import Dexie, { Table } from 'dexie';

export interface LocalInspection {
  localId?: string;
  serverId?: string;
  roomId: string;
  maidId: string | null;
  roomStatus: string;
  items: Array<{
    checklistItemId: string;
    status: 'OK' | 'ISSUE';
    observation: string;
  }>;
  createdAt: number;
  syncStatus: 'pending' | 'data_synced' | 'error' | 'expired';
}

export interface LocalPhoto {
  id?: number;
  inspectionLocalId: string;
  checklistItemId: string;
  file: Blob;
  status: 'pending' | 'uploading' | 'error';
  attempts: number;
}

export class CheckHotelDB extends Dexie {
  inspections!: Table<LocalInspection>;
  photos!: Table<LocalPhoto>;

  constructor() {
    super('CheckHotelDB');
    this.version(1).stores({
      inspections: 'localId, roomId, createdAt, syncStatus',
      photos: '++id, inspectionLocalId, status'
    });
  }
}

export const db = new CheckHotelDB();

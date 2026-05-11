import type { MissionRecord } from '../mission/types';

const DB_NAME = 'ai4context-organizer-v1';
const STORE = 'missions';
const VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onerror = () => reject(req.error ?? new Error('IDB open failed'));
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'missionId' });
      }
    };
  });
}

export async function putMission(record: MissionRecord): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('IDB transaction'));
    tx.objectStore(STORE).put({ ...record, updatedAt: Date.now() });
  });
}

export async function getMission(missionId: string): Promise<MissionRecord | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(missionId);
    req.onsuccess = () => resolve(req.result as MissionRecord | undefined);
    req.onerror = () => reject(req.error ?? new Error('IDB get'));
  });
}

/** Últimas misiones por `updatedAt` descendente */
export async function listMissions(limit = 30): Promise<MissionRecord[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => {
      const rows = (req.result as MissionRecord[]) ?? [];
      rows.sort((a, b) => b.updatedAt - a.updatedAt);
      resolve(rows.slice(0, limit));
    };
    req.onerror = () => reject(req.error ?? new Error('IDB list'));
  });
}

// Style reminder: Archivo editorial cívico — local persistence is explicit and removable by the user.

const DB_NAME = "page-agent-local";
const DB_VERSION = 1;

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!("indexedDB" in window)) return reject(new Error("IndexedDB no disponible"));
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("conversations")) db.createObjectStore("conversations");
      if (!db.objectStoreNames.contains("embeddings")) db.createObjectStore("embeddings");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("No se pudo abrir IndexedDB"));
  });
}

export async function saveLocal<T>(storeName: string, key: string, value: T) {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // The product remains usable without persistence.
  }
}

export async function readLocal<T>(storeName: string, key: string): Promise<T | undefined> {
  try {
    const db = await openDb();
    return await new Promise<T | undefined>((resolve, reject) => {
      const request = db.transaction(storeName, "readonly").objectStore(storeName).get(key);
      request.onsuccess = () => resolve(request.result as T | undefined);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return undefined;
  }
}

export async function clearLocal(storeName: string, key?: string) {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      if (key) tx.objectStore(storeName).delete(key);
      else tx.objectStore(storeName).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Safe no-op when IndexedDB is unavailable.
  }
}

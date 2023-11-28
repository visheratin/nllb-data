interface Coords {
  id: string;
  x: number;
  y: number;
  cluster: number;
}

interface StoredData {
  id: string;
  data: Coords[];
}

export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("nllb-data-viewer", 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("jsonData")) {
        db.createObjectStore("jsonData", { keyPath: "id" });
      }
    };

    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event: Event) => {
      reject(
        `Database error: ${(event.target as IDBOpenDBRequest).error?.message}`
      );
    };
  });
};

export const getDataFromDB = async (
  db: IDBDatabase
): Promise<Coords[] | null> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["jsonData"], "readonly");
    const store = transaction.objectStore("jsonData");
    const request = store.get("coordsData");

    request.onsuccess = (event) => {
      const result = (event.target as IDBRequest<StoredData>).result;
      if (result) {
        resolve(result.data);
      } else {
        resolve(null);
      }
    };

    request.onerror = (event) => {
      reject(
        `Error fetching data from DB: ${
          (event.target as IDBRequest).error?.message
        }`
      );
    };
  });
};

export const storeDataInDB = async (
  db: IDBDatabase,
  data: Coords[]
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["jsonData"], "readwrite");
    const store = transaction.objectStore("jsonData");
    const request = store.put({ id: "coordsData", data: data });

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(
        `Error storing data: ${(event.target as IDBRequest).error?.message}`
      );
    };
  });
};

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured, ORDERS_COLLECTION } from './firebase.js';
import { createMockOrders } from '../data/mockOrders.js';

const STORAGE_KEY = 'order-system.orders.v2';

/** Firestore Timestamp / 字串 / 空值都轉成 ISO 字串。 */
const toIso = (value) => {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string') return value;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  return new Date(value).toISOString();
};

/* ------------------------------- 本機儲存 ------------------------------- */

const readLocal = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeLocal = (orders) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    /* 無痕模式或空間不足時忽略，不影響操作。 */
  }
};

const localRepository = {
  source: 'local',
  subscribe(onChange) {
    const initial = readLocal() ?? createMockOrders();
    writeLocal(initial);
    onChange(initial, { fromCache: false });

    // 同一台裝置開多個分頁時互相同步。
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) onChange(readLocal() ?? [], { fromCache: false });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  },
  async add(order) {
    const saved = { ...order, id: `order-${Date.now()}` };
    const next = [...(readLocal() ?? []), saved];
    writeLocal(next);
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
    return saved;
  },
  async remove(id) {
    writeLocal((readLocal() ?? []).filter((order) => order.id !== id));
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  },
  async reset() {
    writeLocal(createMockOrders());
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
  },
};

/* ------------------------------- Firestore ------------------------------ */

const firebaseRepository = {
  source: 'firebase',
  subscribe(onChange, onError) {
    const ordersQuery = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'asc'));
    return onSnapshot(
      ordersQuery,
      // 監聽 metadata 才能分辨資料是來自伺服器還是離線快取。
      { includeMetadataChanges: true },
      (snapshot) => {
        onChange(
          snapshot.docs.map((snap) => {
            const data = snap.data();
            return { ...data, id: snap.id, createdAt: toIso(data.createdAt) };
          }),
          { fromCache: snapshot.metadata.fromCache }
        );
      },
      onError
    );
  },
  async add(order) {
    const { id, createdAt, ...payload } = order;
    const ref = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...payload,
      createdAt: serverTimestamp(),
    });
    return { ...order, id: ref.id };
  },
  async remove(id) {
    await deleteDoc(doc(db, ORDERS_COLLECTION, id));
  },
  /** 連線 Firebase 時「重來一輪」＝清空這個 collection，不再塞入展示資料。 */
  async reset() {
    const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    if (snapshot.empty) return;
    const batch = writeBatch(db);
    snapshot.docs.forEach((snap) => batch.delete(snap.ref));
    await batch.commit();
  },
};

export const ordersRepository = isFirebaseConfigured ? firebaseRepository : localRepository;

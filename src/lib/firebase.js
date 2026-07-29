import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase 設定由環境變數提供（見 .env.example）。
 * 尚未填入設定時 isFirebaseConfigured 為 false，
 * 系統會自動退回瀏覽器本機儲存，功能完全一樣，只是不會跨裝置同步。
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const REQUIRED_KEYS = ['apiKey', 'projectId', 'appId'];

export const isFirebaseConfigured = REQUIRED_KEYS.every((key) => Boolean(firebaseConfig[key]));

/** Firestore 中存放這一輪點餐的 collection 名稱。 */
export const ORDERS_COLLECTION = import.meta.env.VITE_FIREBASE_ORDERS_COLLECTION || 'orders';

let firestore = null;

if (isFirebaseConfigured) {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  firestore = getFirestore(app);
}

export const db = firestore;

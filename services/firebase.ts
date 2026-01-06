import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// 使用 vite.config.ts 注入的環境變數
const firebaseConfigRaw = process.env.FIREBASE_CONFIG;

const isValidConfig = (config: string | undefined): boolean => {
  if (!config || config === "undefined" || config.trim() === "") return false;
  try {
    JSON.parse(config);
    return true;
  } catch {
    return false;
  }
};

if (isValidConfig(firebaseConfigRaw)) {
  try {
    const config = JSON.parse(firebaseConfigRaw!);
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    // 靜默失敗，AppContext 會自動切換到 Demo Mode
  }
}

export { auth, db };

export const isFirebaseAvailable = (): boolean => {
  return auth !== null && db !== null;
};
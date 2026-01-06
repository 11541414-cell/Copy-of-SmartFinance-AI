
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Accessing environment variables injected via vite.config.ts
const firebaseConfigRaw = process.env.FIREBASE_CONFIG;

if (firebaseConfigRaw && firebaseConfigRaw.trim() !== "" && firebaseConfigRaw !== "undefined") {
  try {
    const config = JSON.parse(firebaseConfigRaw);
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Failed to parse Firebase configuration:", error);
  }
} else {
  console.warn("No Firebase configuration detected. Running in offline Demo Mode.");
}

export { auth, db };

export const isFirebaseAvailable = (): boolean => {
  return auth !== null && db !== null;
};

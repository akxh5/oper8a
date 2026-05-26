import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCKm0an1RQW0U4cwjexE7T2dk1K9eeGoSQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "oper8a-1580c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "oper8a-1580c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "oper8a-1580c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "219492911660",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:219492911660:web:d18c64a623cb82971b1f89",
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize Firestore
export const db = getFirestore(app)

// Update ELO score for a user
export async function updateUserElo(uid: string, delta: number) {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  let currentElo = 1000;
  if (userSnap.exists() && userSnap.data().elo !== undefined) {
    currentElo = userSnap.data().elo;
  }
  const newElo = currentElo + delta;
  if (userSnap.exists()) {
    await updateDoc(userRef, { elo: newElo });
  } else {
    await setDoc(userRef, { elo: newElo });
  }
  return newElo;
}

export default app

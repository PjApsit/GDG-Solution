/**
 * Firebase Configuration
 * WHY: Centralizes all Firebase initialization. Import from here, never initialize elsewhere.
 * 
 * SETUP: Create a Firebase project at https://console.firebase.google.com
 * 1. Enable Authentication → Google Sign-In
 * 2. Create Firestore Database (start in test mode, then apply security rules)
 * 3. Copy your config from Project Settings → General → Your apps → Web app
 * 4. Create client/.env with the values below
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

// Initialize Firebase only when configured
let app = null;
let auth = null;
let db = null;
let storage = null;
let googleProvider = null;

if (firebaseConfigured) {
  app = initializeApp(firebaseConfig);

  // Auth
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });

  // Firestore with offline persistence (Q7 — Offline/PWA)
  db = getFirestore(app);

  // Enable offline persistence so volunteers can view tasks in dead zones
  try {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence failed: Multiple tabs open.');
      } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence not supported in this browser.');
      }
    });
  } catch {
    // Silently ignore if persistence is already enabled
  }

  // Storage (for temporary image uploads before Gemini processing)
  storage = getStorage(app);
} else {
  console.warn('Firebase not configured. Running frontend in demo mode.');
}

export { app, auth, db, storage, googleProvider };
export default app;

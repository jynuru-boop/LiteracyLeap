import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFirebaseConfig } from './config';

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-doc';
export * from './firestore/use-collection';
export * from '@/hooks/use-memo-firebase';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

// This is a client-side only function.
// In a server component, you should not use this function.
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { firebaseApp: null, auth: null, firestore: null };
  }

  if (!app) {
    if (getApps().length === 0) {
      app = initializeApp(getFirebaseConfig());
    } else {
      app = getApp();
    }
  }

  if (!auth) {
    auth = getAuth(app);
  }
  if (!firestore) {
    firestore = getFirestore(app);
  }

  return { firebaseApp: app, auth, firestore };
}

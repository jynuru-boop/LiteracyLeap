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

let app: FirebaseApp;
if (typeof window !== 'undefined' && getApps().length === 0) {
  app = initializeApp(getFirebaseConfig());
} else if (typeof window !== 'undefined') {
  app = getApp();
}

let auth: Auth;
let firestore: Firestore;

// This is a client-side only function.
// In a server component, you should not use this function.
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { firebaseApp: null, auth: null, firestore: null };
  }

  if (!auth) {
    auth = getAuth(app);
  }
  if (!firestore) {
    firestore = getFirestore(app);
  }

  return { firebaseApp: app, auth, firestore };
}

import { EventEmitter } from 'events';
import type { FirestorePermissionError } from './errors';

type AppEvents = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// This is a simple event emitter that allows us to broadcast events
// from anywhere in the app.
// We are using this to broadcast Firestore permission errors to the
// FirebaseErrorListener component, which will then throw them to be
// caught by the Next.js error overlay.
export const errorEmitter = new EventEmitter<AppEvents>();

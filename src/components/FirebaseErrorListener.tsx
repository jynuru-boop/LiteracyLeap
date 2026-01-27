'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

// This is a client component that listens for Firestore permission errors
// and throws them to be caught by the Next.js error overlay.
// This is only active in development and does nothing in production.
export function FirebaseErrorListener() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const unSub = errorEmitter.on('permission-error', (error) => {
      // Throw the error to be caught by the Next.js error overlay
      throw error;
    });

    return () => {
      unSub();
    };
  }, []);

  return null;
}

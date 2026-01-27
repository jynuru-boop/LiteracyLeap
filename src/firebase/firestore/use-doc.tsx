'use client';

import { useEffect, useState, useRef } from 'react';
import type {
  DocumentReference,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

export const useDoc = <T extends DocumentData>(
  docRef: DocumentReference<T> | null
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<FirestoreError | null>(null);
  const [loading, setLoading] = useState(true);

  // We use a ref to store the docRef, and only update it when the docRef
  // has actually changed. This is to prevent infinite loops.
  const docRefRef = useRef<DocumentReference<T> | null>(docRef);
  if (docRef && docRefRef.current !== docRef) {
    docRefRef.current = docRef;
  }

  useEffect(() => {
    if (!docRefRef.current) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      docRefRef.current,
      (snapshot: DocumentSnapshot<T>) => {
        if (snapshot.exists()) {
          setData({ ...snapshot.data(), id: snapshot.id });
        } else {
          setData(null);
        }
        setError(null);
        setLoading(false);
      },
      (err: FirestoreError) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRefRef.current]);

  return { data, error, loading };
};

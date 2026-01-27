'use client';

import { useEffect, useState, useRef } from 'react';
import type {
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

export const useCollection = <T extends DocumentData>(
  query: Query<T> | null
) => {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<FirestoreError | null>(null);
  const [loading, setLoading] = useState(true);

  // We use a ref to store the query, and only update it when the query
  // has actually changed. This is to prevent infinite loops.
  const queryRef = useRef<Query<T> | null>(query);

  if (query && queryRef.current !== query) {
    queryRef.current = query;
  }

  useEffect(() => {
    if (!queryRef.current) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      queryRef.current,
      (snapshot: QuerySnapshot<T>) => {
        const data: T[] = [];
        snapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setData(data);
        setError(null);
        setLoading(false);
      },
      (err: FirestoreError) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [queryRef.current]);

  return { data, error, loading };
};

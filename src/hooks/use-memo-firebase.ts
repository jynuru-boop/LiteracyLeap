'use client';
import { useMemo } from 'react';
import type {
  Query,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore';

// This is a helper hook to memoize a Firestore query or document reference.
// This is useful to prevent infinite loops when using the useCollection or
// useDoc hooks, which take a query or document reference as a dependency.
export function useMemoFirebase<
  T extends Query<DocumentData> | DocumentReference<DocumentData>
>(
  factory: () => T | null,
  deps: React.DependencyList | undefined
): T | null {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}

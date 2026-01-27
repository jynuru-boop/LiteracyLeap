'use client';
import { addDoc, collection, Firestore } from 'firebase/firestore';
import type { ChallengeAttempt } from '@/app/types';

export async function saveAttempts(
  firestore: Firestore,
  userId: string,
  attempts: Omit<ChallengeAttempt, 'id' | 'date'>[]
) {
  if (!firestore || !userId) return;

  const attemptsCollection = collection(firestore, 'users', userId, 'attempts');
  const today = new Date().toISOString().split('T')[0];

  const promises = attempts.map(attempt => 
    addDoc(attemptsCollection, { ...attempt, date: today })
  );

  await Promise.all(promises);
}

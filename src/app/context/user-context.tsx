'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, Unsubscribe, DocumentData } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { BADGE_RANKS } from '@/app/data';
import type { Badge } from '@/app/types';

export type UserProfile = {
  id: string;
  name: string;
  badge: Badge['name'];
  points: number;
  badgeImageId: string;
  emoji: string;
  lastTreasureDraw?: string;
  role?: 'student' | 'teacher';
  classId?: string;
};

type UserContextType = {
  user: UserProfile | null;
  loading: boolean;
  addPoints: (points: number) => void;
  claimDailyTreasure: (points: number) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { user: authUser, isLoading: authLoading } = useUser();
    const firestore = useFirestore();
    
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe: Unsubscribe | undefined;

        if (authLoading) {
            setLoading(true);
            return;
        }

        if (!authUser || !firestore) {
            setUser(null);
            setLoading(false);
            return;
        }

        const userDocRef = doc(firestore, 'users', authUser.uid);
        unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as DocumentData;
                const currentPoints = data.points || 0;
                const newBadge = BADGE_RANKS.slice().reverse().find(b => currentPoints >= b.minPoints) || BADGE_RANKS[0];
                setUser({
                    id: docSnap.id,
                    name: data.name || authUser.displayName || '학생',
                    points: currentPoints,
                    badge: newBadge.name,
                    badgeImageId: newBadge.imageId,
                    emoji: newBadge.emoji,
                    lastTreasureDraw: data.lastTreasureDraw,
                    role: data.role || 'student',
                    classId: data.classId,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching user document:", error);
            setLoading(false);
        });

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [authUser, authLoading, firestore]);

    const updateLeaderboard = (userId: string, name: string, points: number) => {
        if (!firestore) return;
        const newBadge = BADGE_RANKS.slice().reverse().find(b => points >= b.minPoints) || BADGE_RANKS[0];
        const leaderboardDocRef = doc(firestore, 'leaderboard', userId);
        setDoc(leaderboardDocRef, {
            name,
            points,
            emoji: newBadge.emoji,
        }, { merge: true });
    };

    const addPoints = (points: number) => {
        if (!user || !user.id || !firestore) return;

        const newPoints = user.points + points;
        const userDocRef = doc(firestore, 'users', user.id);
        
        setDoc(userDocRef, { points: newPoints }, { merge: true }).then(() => {
            updateLeaderboard(user.id, user.name, newPoints);
        });
    };
    
    const claimDailyTreasure = (points: number) => {
        if (!user || !user.id || !firestore) return;

        const newPoints = user.points + points;
        const today = new Date().toISOString().split('T')[0];
        const userDocRef = doc(firestore, 'users', user.id);
        
        setDoc(userDocRef, { 
            points: newPoints,
            lastTreasureDraw: today 
        }, { merge: true }).then(() => {
            updateLeaderboard(user.id, user.name, newPoints);
        });
    };

    return (
        <UserContext.Provider value={{ user, loading, addPoints, claimDailyTreasure }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}

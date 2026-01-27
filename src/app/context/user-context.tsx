'use client';

import React, { createContext, useContext, useState } from 'react';
import { BADGE_RANKS } from '@/app/data';
import type { Badge } from '@/app/types';

type User = {
  name: string;
  badge: Badge['name'];
  points: number;
  badgeImageId: string;
};

type UserContextType = {
  user: User;
  addPoints: (points: number) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    name: '즐거운 학생',
    badge: '씨앗',
    points: 0,
    badgeImageId: 'badge-seedling',
  });

  const addPoints = (points: number) => {
    setUser(currentUser => {
        const newPoints = currentUser.points + points;
        const newBadge = BADGE_RANKS.slice().reverse().find(b => newPoints >= b.minPoints) || BADGE_RANKS[0];
        return {
            ...currentUser,
            points: newPoints,
            badge: newBadge.name,
            badgeImageId: newBadge.imageId,
        };
    });
  };

  return (
    <UserContext.Provider value={{ user, addPoints }}>
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

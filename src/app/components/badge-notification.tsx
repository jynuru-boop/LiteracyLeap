'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Badge } from '@/app/types';

type BadgeNotificationProps = {
  badge: Badge | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BadgeNotification({ badge, open, onOpenChange }: BadgeNotificationProps) {
  if (!badge) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="items-center">
          <DialogTitle className="text-2xl font-headline text-primary">새로운 뱃지 획득!</DialogTitle>
          <DialogDescription>축하해요! 새로운 레벨에 도달했어요.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {badge.emoji && (
            <div className="flex items-center justify-center w-32 h-32 rounded-full border-4 border-accent shadow-lg animate-pulse bg-amber-100">
              <span className="text-7xl">{badge.emoji}</span>
            </div>
          )}
          <p className="text-3xl font-bold text-accent">{badge.name}</p>
        </div>
        <Button onClick={() => onOpenChange(false)}>계속하기!</Button>
      </DialogContent>
    </Dialog>
  );
}

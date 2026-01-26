'use client';

import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Badge } from '@/app/types';

type BadgeNotificationProps = {
  badge: Badge | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BadgeNotification({ badge, open, onOpenChange }: BadgeNotificationProps) {
  if (!badge) return null;

  const badgeImage = PlaceHolderImages.find((img) => img.id === badge.imageId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="items-center">
          <DialogTitle className="text-2xl font-headline text-primary">New Badge Unlocked!</DialogTitle>
          <DialogDescription>Congratulations! You've reached a new level.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          {badgeImage && (
            <Image
              src={badgeImage.imageUrl}
              alt={`${badge.name} Badge`}
              width={120}
              height={120}
              data-ai-hint={badgeImage.imageHint}
              className="rounded-full border-4 border-accent shadow-lg animate-pulse"
            />
          )}
          <p className="text-3xl font-bold text-accent">{badge.name}</p>
        </div>
        <Button onClick={() => onOpenChange(false)}>Keep Going!</Button>
      </DialogContent>
    </Dialog>
  );
}

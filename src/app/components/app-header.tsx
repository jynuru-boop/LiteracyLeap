'use client';

import Image from 'next/image';
import type { Badge } from '@/app/types';
import { BADGE_RANKS } from '@/app/data';
import { Progress } from '@/components/ui/progress';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

type AppHeaderProps = {
  score: number;
  badge: Badge;
};

export default function AppHeader({ score, badge }: AppHeaderProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setAnimatedScore(score));
    return () => cancelAnimationFrame(animation);
  }, [score]);

  const badgeImage = PlaceHolderImages.find((img) => img.id === badge.imageId);

  const nextBadgeIndex = BADGE_RANKS.findIndex((b) => b.name === badge.name) + 1;
  const nextBadge = BADGE_RANKS[nextBadgeIndex];
  const progress = nextBadge
    ? Math.max(
        0,
        Math.min(
          100,
          ((score - badge.minPoints) / (nextBadge.minPoints - badge.minPoints)) * 100
        )
      )
    : 100;

  return (
    <header className="w-full max-w-4xl p-4 sm:p-6">
      <div className="flex flex-col items-center justify-center text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-bold font-headline text-primary-foreground drop-shadow-md bg-primary/80 px-4 py-2 rounded-lg">
          LiteracyLeap
        </h1>
        <p className="text-muted-foreground mt-2">일일 AI 챌린지로 문해력의 도약을 이루세요!</p>
      </div>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {badgeImage && (
              <Image
                src={badgeImage.imageUrl}
                alt={`${badge.name} Badge`}
                width={80}
                height={80}
                data-ai-hint={badgeImage.imageHint}
                className="rounded-full border-4 border-accent shadow-lg"
              />
            )}
            <div className="w-full">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-bold text-lg text-primary-foreground/90">{badge.name}</span>
                <span className="font-semibold text-xl" style={{ transition: 'all 0.5s ease-out' }}>
                  {Math.round(animatedScore)} <span className="text-sm text-muted-foreground">points</span>
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              {nextBadge && (
                <div className="text-xs text-muted-foreground mt-1 text-right">
                  {nextBadge.minPoints - score > 0 ? `${nextBadge.minPoints - score} points to` : 'Leveled up to'} {nextBadge.name}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </header>
  );
}

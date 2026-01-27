import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type React from 'react';

type ChallengeCardProps = {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function ChallengeCard({ icon: Icon, title, children, className }: ChallengeCardProps) {
  return (
    <Card className={cn('w-full shadow-lg transition-all hover:shadow-xl', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-headline text-foreground">
          <Icon className="h-7 w-7 text-accent" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}

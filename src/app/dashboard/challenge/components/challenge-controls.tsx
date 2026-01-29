'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type ChallengeControlsProps = {
  questionCount: number;
  onCheckAnswers: () => void;
  isCorrect: (boolean | null)[];
};

export default function ChallengeControls({ questionCount, onCheckAnswers, isCorrect }: ChallengeControlsProps) {
  
  const handleCheck = () => {
    onCheckAnswers();
  };
  
  const attemptedCount = isCorrect.filter(c => c !== null).length;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">진행률</p>
        <p className="text-sm font-bold">{attemptedCount} / {questionCount}</p>
      </div>
      <Progress value={(attemptedCount / questionCount) * 100} className="w-full mb-4" />
      <Button onClick={handleCheck} disabled={attemptedCount < questionCount} className="w-full text-lg py-6">
        채점하기
      </Button>
    </div>
  );
}

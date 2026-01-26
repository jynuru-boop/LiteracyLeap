'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ChallengeControlsProps = {
  questionCount: number;
  onCheckAnswers: () => void;
  isCorrect: (boolean | null)[];
};

export default function ChallengeControls({ questionCount, onCheckAnswers, isCorrect }: ChallengeControlsProps) {
  const [showResult, setShowResult] = useState(false);
  const router = useRouter();
  
  const handleCheck = () => {
    onCheckAnswers();
    setShowResult(true);
  };
  
  const correctCount = isCorrect.filter(c => c === true).length;
  const attemptedCount = isCorrect.filter(c => c !== null).length;

  if (showResult) {
    return (
        <div className="mt-8 p-6 bg-slate-50 rounded-lg shadow-inner text-center">
            <h3 className="text-xl font-bold mb-4">채점 결과</h3>
            <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-green-600 text-lg">
                    <CheckCircle2 />
                    <span className="font-bold">맞은 개수: {correctCount}</span>
                </div>
                <div className="flex items-center gap-2 text-red-600 text-lg">
                    <XCircle />
                    <span className="font-bold">틀린 개수: {questionCount - correctCount}</span>
                </div>
            </div>
             <Button className="mt-6" onClick={() => router.refresh()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                새로운 문제 풀기
            </Button>
        </div>
    )
  }

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

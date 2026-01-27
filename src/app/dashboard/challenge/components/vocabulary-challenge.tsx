'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/app/context/user-context';
import ChallengeCard from '@/app/components/challenge-card';
import { Languages, CheckCircle2, XCircle, Home } from 'lucide-react';
import type { Challenge, ChallengeAttempt } from '@/app/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import { saveAttempts } from '@/app/services/challenge-service';

type VocabularyChallengeProps = {
  challenge: Challenge['vocabulary'];
};

export default function VocabularyChallenge({ challenge }: VocabularyChallengeProps) {
  const router = useRouter();
  const { addPoints, user } = useUserContext();
  const firestore = useFirestore();
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [pointsAdded, setPointsAdded] = useState(false);

  const isCorrect = userAnswer === challenge.answer;

  const handleCheckAnswer = () => {
    if (!userAnswer) return;
    
    setShowResult(true);
    if (!user || !firestore) return;
    
    const attempt: Omit<ChallengeAttempt, 'id' | 'date'> = {
        category: 'vocabulary',
        isCorrect: isCorrect,
    };
    saveAttempts(firestore, user.id, [attempt]);

    if (isCorrect && !pointsAdded) {
      addPoints(20);
      setPointsAdded(true);
    }
  };

  return (
    <div className="space-y-6">
      <ChallengeCard icon={Languages} title="오늘의 사자성어/속담 퀴즈">
        <p className="text-xl text-center font-semibold text-foreground/90 py-4 px-2">
          "{challenge.question}"
        </p>
      </ChallengeCard>

      <Card className={cn(
        'transition-all',
        showResult && !isCorrect && 'border-red-400 bg-red-50/60',
        showResult && isCorrect && 'border-green-400 bg-green-50/60'
        )}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl">
            <span>정답 선택</span>
             {showResult && (
                isCorrect ? <CheckCircle2 className="text-green-600" /> : <XCircle className="text-red-600" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup onValueChange={setUserAnswer} value={userAnswer || ''} disabled={showResult}>
            <div className="space-y-3">
              {challenge.options.map((option, index) => {
                 const isCorrectOption = option === challenge.answer;
                 const isSelected = userAnswer === option;
                return (
                  <Label
                    key={index}
                    htmlFor={`option-vocab-${index}`}
                    className={cn(
                      'flex items-center gap-4 rounded-lg border p-4 text-base cursor-pointer transition-colors bg-background',
                      !showResult && 'hover:bg-accent/50',
                      showResult && isCorrectOption && 'border-green-500 bg-green-100/80 ring-2 ring-green-300',
                      showResult && isSelected && !isCorrectOption && 'border-red-500 bg-red-100/80 line-through',
                      showResult && 'cursor-not-allowed opacity-80'
                    )}
                  >
                    <RadioGroupItem value={option} id={`option-vocab-${index}`} className="h-5 w-5" />
                    <span className="flex-1">{option}</span>
                    {showResult && isCorrectOption && <CheckCircle2 className="text-green-600" />}
                  </Label>
              )})}
            </div>
          </RadioGroup>

          {!showResult && (
            <Button onClick={handleCheckAnswer} className="w-full text-lg py-6" disabled={!userAnswer}>
              정답 확인
            </Button>
          )}
        </CardContent>
      </Card>
      
      {showResult && (
         <div className="mt-8 p-6 bg-slate-50 rounded-lg shadow-inner text-center space-y-6">
            <div>
                {isCorrect ? (
                    <div className="flex flex-col items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-12 w-12" />
                        <p className="text-2xl font-bold">정답입니다! (+20점 🎉)</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-red-600">
                        <XCircle className="h-12 w-12" />
                        <p className="text-2xl font-bold">아쉬워요, 정답을 확인해보세요.</p>
                    </div>
                )}
            </div>

            <div className="text-left space-y-2">
                <h3 className="font-bold text-base text-muted-foreground">예문</h3>
                <p className="text-lg mt-1 italic">"{challenge.example}"</p>
            </div>

            <Button className="mt-6" onClick={() => router.push('/dashboard')}>
                <Home className="mr-2 h-4 w-4" />
                메인으로 돌아가기
            </Button>
         </div>
      )}
    </div>
  );
}

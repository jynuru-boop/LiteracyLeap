'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/app/context/user-context';
import ChallengeCard from '@/app/components/challenge-card';
import { Languages, Lightbulb, CheckCircle2, XCircle, Home } from 'lucide-react';
import type { Challenge, ChallengeAttempt } from '@/app/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useFirestore } from '@/firebase';
import { saveAttempts } from '@/app/services/challenge-service';

type VocabularyChallengeProps = {
  challenge: Challenge['vocabulary'];
};

export default function VocabularyChallenge({ challenge }: VocabularyChallengeProps) {
  const router = useRouter();
  const { addPoints, user } = useUserContext();
  const firestore = useFirestore();
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [pointsAdded, setPointsAdded] = useState(false);

  const isCorrect = userAnswer.trim() === challenge.answer;

  const handleCheckAnswer = () => {
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

      <Card>
        <CardContent className="pt-6 space-y-4">
          {!showResult ? (
            <>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="text"
                  placeholder="정답을 입력하세요"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="text-lg h-12 flex-grow"
                />
                <Button onClick={handleCheckAnswer} className="h-12 text-base" disabled={!userAnswer}>
                  정답 확인
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowHint(true)} disabled={showHint}>
                <Lightbulb className="mr-2 h-4 w-4" />
                초성 힌트 보기
              </Button>
              {showHint && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertTitle className="text-yellow-800 font-bold">초성 힌트!</AlertTitle>
                  <AlertDescription className="text-2xl font-bold text-yellow-900 text-center tracking-widest py-2">
                    {challenge.hint}
                  </AlertDescription>
                </Alert>
              )}
            </>
          ) : (
            <div className="text-center">
              {isCorrect ? (
                <div className="flex flex-col items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-16 w-16" />
                  <p className="text-2xl font-bold">정답입니다!</p>
                  <p className="text-lg font-semibold text-green-700">+20점 획득! 🎉</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-red-600">
                  <XCircle className="h-16 w-16" />
                  <p className="text-2xl font-bold">아쉬워요, 정답은 아래와 같아요.</p>
                  <p className="text-base text-muted-foreground mt-2">입력한 답: {userAnswer}</p>
                </div>
              )}
              
              <div className="mt-6 p-4 bg-slate-50 rounded-lg text-left space-y-4">
                  <div>
                      <h3 className="font-bold text-base text-muted-foreground">정답</h3>
                      <p className="text-2xl mt-1 font-bold text-primary">{challenge.answer}</p>
                  </div>
                  <hr/>
                  <div>
                      <h3 className="font-bold text-base text-muted-foreground">예문</h3>
                      <p className="text-lg mt-1 italic">"{challenge.example}"</p>
                  </div>
              </div>

              <Button onClick={() => router.push('/dashboard')} className="mt-8">
                <Home className="mr-2 h-4 w-4" />
                메인으로 돌아가기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

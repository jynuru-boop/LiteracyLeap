'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/app/context/user-context';
import type { Challenge, ChallengeAttempt, QuizLogPayload } from '@/app/types';
import QuestionCard from './question-card';
import ChallengeControls from './challenge-controls';
import { useFirestore } from '@/firebase';
import { saveAttempts, saveQuizLog } from '@/app/services/challenge-service';
import { Button } from '@/components/ui/button';
import { Home, CheckCircle2, XCircle } from 'lucide-react';

type VocabularyChallengeProps = {
  challenge: Challenge['vocabulary'];
};

export default function VocabularyChallenge({ challenge }: VocabularyChallengeProps) {
    const { addPoints, user } = useUserContext();
    const firestore = useFirestore();
    const router = useRouter();
    const [answers, setAnswers] = useState<(string | null)[]>(Array(challenge.questions.length).fill(null));
    const [showResult, setShowResult] = useState(false);
    const [pointsAdded, setPointsAdded] = useState(false);

    const handleAnswerSelect = (questionIndex: number, answer: string) => {
        if (showResult) return;
        const newAnswers = [...answers];
        newAnswers[questionIndex] = answer;
        setAnswers(newAnswers);
    };

    const handleCheckAnswers = () => {
      setShowResult(true);
      if (pointsAdded || !user || !firestore) return;

      const attemptsToSave: Omit<ChallengeAttempt, 'id' | 'date'>[] = [];
      const wrongAnswers: QuizLogPayload['wrongAnswers'] = [];
      let correctCount = 0;

      challenge.questions.forEach((q, i) => {
          const isCorrect = answers[i] === q.answer;
          if (isCorrect) {
              correctCount++;
          } else if (answers[i] !== null) {
            wrongAnswers.push({
                question: q.question,
                userAnswer: answers[i]!,
                correctAnswer: q.answer,
            });
          }
          if (answers[i] !== null) { // Only save attempted questions
                attemptsToSave.push({
                  category: 'vocabulary',
                  isCorrect: isCorrect,
              });
          }
      });

      if (attemptsToSave.length > 0) {
          saveAttempts(firestore, user.id, attemptsToSave);
      }

      const pointsToAward = correctCount * 20;
      if (pointsToAward > 0) {
          addPoints(pointsToAward);
      }
      
      saveQuizLog(firestore, user.id, {
        category: 'vocabulary',
        score: pointsToAward,
        wrongAnswers: wrongAnswers,
      });

      setPointsAdded(true);
    };

    const correctStatus = challenge.questions.map((q, i) => {
        if (answers[i] === null) return null;
        return answers[i] === q.answer;
    });

    const correctCount = correctStatus.filter(c => c === true).length;
    const pointsToAward = correctCount * 20;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {challenge.questions.map((q, index) => (
          <QuestionCard
            key={index}
            questionIndex={index}
            question={q.question}
            options={q.options}
            answer={q.answer}
            userAnswer={answers[index]}
            onAnswerSelect={(answer) => handleAnswerSelect(index, answer)}
            showResult={showResult}
            example={q.example}
          />
        ))}
      </div>
      
      {!showResult ? (
         <ChallengeControls 
            questionCount={challenge.questions.length}
            onCheckAnswers={handleCheckAnswers}
            isCorrect={correctStatus}
        />
      ) : (
        <div className="mt-8 p-6 bg-slate-50 rounded-lg shadow-inner text-center space-y-6">
            <div>
                <div className="flex flex-col items-center gap-2 text-primary">
                    <CheckCircle2 className="h-12 w-12" />
                    <p className="text-2xl font-bold">참 잘했어요! (+{pointsToAward}점 🎉)</p>
                </div>
                 <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-green-600 text-lg">
                        <CheckCircle2 />
                        <span className="font-bold">맞은 개수: {correctCount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-600 text-lg">
                        <XCircle />
                        <span className="font-bold">틀린 개수: {challenge.questions.length - correctCount}</span>
                    </div>
                </div>
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

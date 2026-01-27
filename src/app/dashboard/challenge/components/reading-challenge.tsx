'use client';

import { useState } from 'react';
import { useUserContext } from '@/app/context/user-context';
import ChallengeCard from '@/app/components/challenge-card';
import { BookOpen } from 'lucide-react';
import type { Challenge, ChallengeAttempt } from '@/app/types';
import QuestionCard from './question-card';
import ChallengeControls from './challenge-controls';
import { useFirestore } from '@/firebase';
import { saveAttempts } from '@/app/services/challenge-service';

type ReadingChallengeProps = {
  challenge: Challenge['readingComprehension'];
};

export default function ReadingChallenge({ challenge }: ReadingChallengeProps) {
    const { addPoints, user } = useUserContext();
    const firestore = useFirestore();
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
      let correctCount = 0;

      challenge.questions.forEach((q, i) => {
          const isCorrect = answers[i] === q.answer;
          if (isCorrect) {
              correctCount++;
          }
          if (answers[i] !== null) { // Only save attempted questions
                attemptsToSave.push({
                  category: 'reading',
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
      setPointsAdded(true);
    };

    const correctStatus = challenge.questions.map((q, i) => {
        if (answers[i] === null) return null;
        return answers[i] === q.answer;
    });

  return (
    <div className="space-y-6">
      <ChallengeCard icon={BookOpen} title="지문" className="bg-primary/5">
        <div className="prose max-w-none text-base text-foreground/90 whitespace-pre-wrap leading-loose">
          {challenge.text}
        </div>
      </ChallengeCard>
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
          />
        ))}
      </div>
       <ChallengeControls 
        questionCount={challenge.questions.length}
        onCheckAnswers={handleCheckAnswers}
        isCorrect={correctStatus}
      />
    </div>
  );
}

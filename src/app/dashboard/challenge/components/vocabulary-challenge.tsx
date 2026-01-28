'use client';

import { useState } from 'react';
import { useUserContext } from '@/app/context/user-context';
import type { Challenge, ChallengeAttempt, QuizLogPayload } from '@/app/types';
import QuestionCard from './question-card';
import ChallengeControls from './challenge-controls';
import { useFirestore } from '@/firebase';
import { saveAttempts, saveQuizLog } from '@/app/services/challenge-service';

type VocabularyChallengeProps = {
  challenge: Challenge['vocabulary'];
};

export default function VocabularyChallenge({ challenge }: VocabularyChallengeProps) {
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
      
       <ChallengeControls 
        questionCount={challenge.questions.length}
        onCheckAnswers={handleCheckAnswers}
        isCorrect={correctStatus}
      />
    </div>
  );
}

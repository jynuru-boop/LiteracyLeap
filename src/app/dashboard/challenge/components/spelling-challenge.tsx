'use client';

import { useState } from 'react';
import type { Challenge } from '@/app/types';
import QuestionCard from './question-card';
import ChallengeControls from './challenge-controls';


type SpellingChallengeProps = {
  challenge: Challenge['spelling'];
};

export default function SpellingChallenge({ challenge }: SpellingChallengeProps) {
    const [answers, setAnswers] = useState<(string | null)[]>(Array(challenge.questions.length).fill(null));
    const [showResult, setShowResult] = useState(false);

    const handleAnswerSelect = (questionIndex: number, answer: string) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = answer;
        setAnswers(newAnswers);
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
          />
        ))}
      </div>
       <ChallengeControls 
        questionCount={challenge.questions.length}
        onCheckAnswers={() => setShowResult(true)}
        isCorrect={correctStatus}
      />
    </div>
  );
}

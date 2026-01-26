'use client';

import { useState } from 'react';
import ChallengeCard from '@/app/components/challenge-card';
import { BookOpen } from 'lucide-react';
import type { Challenge } from '@/app/types';
import QuestionCard from './question-card';
import ChallengeControls from './challenge-controls';


type ReadingChallengeProps = {
  challenge: Challenge['readingComprehension'];
};

export default function ReadingChallenge({ challenge }: ReadingChallengeProps) {
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
      <ChallengeCard icon={BookOpen} title="지문" className="bg-primary/5">
        <div className="prose max-w-none text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">
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
        onCheckAnswers={() => setShowResult(true)}
        isCorrect={correctStatus}
      />
    </div>
  );
}

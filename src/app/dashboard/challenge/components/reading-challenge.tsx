'use client';

import { useState, useRef, useEffect } from 'react';
import { useUserContext } from '@/app/context/user-context';
import ChallengeCard from '@/app/components/challenge-card';
import { BookOpen, Volume2, Pause, Loader2 } from 'lucide-react';
import type { Challenge, ChallengeAttempt, QuizLogPayload } from '@/app/types';
import QuestionCard from './question-card';
import ChallengeControls from './challenge-controls';
import { useFirestore } from '@/firebase';
import { saveAttempts, saveQuizLog } from '@/app/services/challenge-service';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { Button } from '@/components/ui/button';

type ReadingChallengeProps = {
  challenge: Challenge['readingComprehension'];
};

export default function ReadingChallenge({ challenge }: ReadingChallengeProps) {
    const { addPoints, user } = useUserContext();
    const firestore = useFirestore();
    const [answers, setAnswers] = useState<(string | null)[]>(Array(challenge.questions.length).fill(null));
    const [showResult, setShowResult] = useState(false);
    const [pointsAdded, setPointsAdded] = useState(false);

    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleListen = async () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            return;
        }

        setIsGeneratingAudio(true);
        try {
            const response = await textToSpeech(challenge.text);
            setAudioSrc(response.media);
        } catch (error) {
            console.error("Failed to generate audio:", error);
        } finally {
            setIsGeneratingAudio(false);
        }
    };

    useEffect(() => {
        if (audioSrc && audioRef.current) {
            audioRef.current.play();
        }
    }, [audioSrc]);

    const ttsButton = (
        <Button onClick={handleListen} disabled={isGeneratingAudio} variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            {isGeneratingAudio ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
                <Pause className="h-5 w-5" />
            ) : (
                <Volume2 className="h-5 w-5" />
            )}
            <span className="sr-only">지문 들려주기</span>
        </Button>
    );

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
      
      saveQuizLog(firestore, user.id, {
          category: 'reading',
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
      <ChallengeCard icon={BookOpen} title="지문" className="bg-primary/5" actions={ttsButton}>
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
      {audioSrc && (
        <audio 
            ref={audioRef} 
            src={audioSrc} 
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            hidden 
        />
      )}
    </div>
  );
}

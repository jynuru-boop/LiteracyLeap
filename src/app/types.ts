import type { GenerateDailyChallengeOutput } from '@/ai/flows/generate-daily-challenge';

export type Challenge = GenerateDailyChallengeOutput;

export interface Badge {
  name: '씨앗' | '새싹이' | '무럭이' | '활짝이' | '주렁이';
  minPoints: number;
  imageId: string;
  emoji: string;
}

export type ChallengeAttempt = {
  id: string;
  category: 'reading' | 'vocabulary' | 'spelling';
  date: string;
  isCorrect: boolean;
};

export type LeaderboardEntry = {
  id: string;
  name: string;
  points: number;
  emoji: string;
};

export type QuizLog = {
  id: string;
  date: string;
  category: 'reading' | 'vocabulary' | 'spelling';
  score: number;
  wrongAnswers: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
  }[];
};

export type QuizLogPayload = Omit<QuizLog, 'id' | 'date'>;

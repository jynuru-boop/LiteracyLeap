import type { GenerateDailyChallengeOutput } from '@/ai/flows/generate-daily-challenge';

export type Challenge = GenerateDailyChallengeOutput;

export interface Badge {
  name: '씨앗' | '새싹' | '꽃' | '열매';
  minPoints: number;
  imageId: string;
}

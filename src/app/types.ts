import type { GenerateDailyChallengeOutput } from '@/ai/flows/generate-daily-challenge';

export type Challenge = GenerateDailyChallengeOutput;

export interface Badge {
  name: 'Seedling' | 'Sprout' | 'Blossom' | 'Fruitful';
  minPoints: number;
  imageId: string;
}

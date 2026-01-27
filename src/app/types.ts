import type { GenerateDailyChallengeOutput } from '@/ai/flows/generate-daily-challenge';

export type Challenge = GenerateDailyChallengeOutput;

export interface Badge {
  name: '씨앗' | '새싹이' | '무럭이' | '활짝이' | '주렁이';
  minPoints: number;
  imageId: string;
}

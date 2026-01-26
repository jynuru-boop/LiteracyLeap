'use server';

/**
 * @fileOverview A daily literacy challenge generator AI agent.
 *
 * - generateDailyChallenge - A function that generates a daily set of literacy challenges.
 * - GenerateDailyChallengeInput - The input type for the generateDailyChallenge function.
 * - GenerateDailyChallengeOutput - The return type for the generateDailyChallenge function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyChallengeInputSchema = z.object({
  studentLevel: z.number().describe('The current level of the student, based on their accumulated points.').default(1),
});
export type GenerateDailyChallengeInput = z.infer<typeof GenerateDailyChallengeInputSchema>;

const GenerateDailyChallengeOutputSchema = z.object({
  readingComprehension: z.object({
    text: z.string().describe('A short reading comprehension text suitable for the student level.'),
    questions: z.array(z.string()).describe('Two reading comprehension questions based on the text.'),
  }),
  vocabulary: z.object({
    idiom: z.string().describe('An idiom or proverb appropriate for the student level.'),
    definition: z.string().describe('The definition of the idiom or proverb.'),
    example: z.string().describe('An example sentence using the idiom or proverb.'),
  }),
  spelling: z.object({
    question1: z.string().describe('A spelling and grammar question.'),
    question2: z.string().describe('A second spelling and grammar question.'),
  }),
});
export type GenerateDailyChallengeOutput = z.infer<typeof GenerateDailyChallengeOutputSchema>;

export async function generateDailyChallenge(input: GenerateDailyChallengeInput): Promise<GenerateDailyChallengeOutput> {
  return generateDailyChallengeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyChallengePrompt',
  input: {schema: GenerateDailyChallengeInputSchema},
  output: {schema: GenerateDailyChallengeOutputSchema},
  prompt: `You are an expert literacy challenge generator for elementary school students. You will tailor the challenges to the student's level.

  Student Level: {{{studentLevel}}}

  Generate a daily literacy challenge including:

  - Reading Comprehension: A short text suitable for the student level, followed by two reading comprehension questions.
  - Vocabulary: An idiom or proverb appropriate for the student level, its definition, and an example sentence.
  - Spelling and Grammar: Two questions focusing on Korean spelling and grammar rules, including spacing.

  Please structure your response in JSON format, including the text and questions for reading comprehension, the idiom, definition, and example for vocabulary, and the two spelling and grammar questions.

  Ensure the questions are challenging but attainable for the given student level. All the text and questions must be in Korean.`,
});

const generateDailyChallengeFlow = ai.defineFlow(
  {
    name: 'generateDailyChallengeFlow',
    inputSchema: GenerateDailyChallengeInputSchema,
    outputSchema: GenerateDailyChallengeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

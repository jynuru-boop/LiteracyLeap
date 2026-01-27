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
    text: z.string().describe('A reading comprehension text of at least 5 to 7 sentences, suitable for the student level.'),
    questions: z.array(z.object({
        question: z.string().describe('A reading comprehension question based on the text.'),
        options: z.array(z.string()).length(4).describe('Four unique multiple choice options for the question. There should not be any duplicate options.'),
        answer: z.string().describe('The correct option for the question.'),
    })).length(2).describe('An array of two reading comprehension questions, each with four unique options and one answer.'),
  }),
  vocabulary: z.object({
    question: z.string().describe('A definition of an idiom or proverb, phrased as a question asking for the idiom/proverb itself. Example: "아주 쉬운 일을 두고 하는 말은?"'),
    answer: z.string().describe('The correct idiom or proverb. Example: "식은 죽 먹기"'),
    hint: z.string().describe('The initial consonants (초성) of the answer as a hint. Example: "ㅅㅇ ㅈ ㅁㄱ"'),
    example: z.string().describe('An example sentence using the idiom or proverb.'),
  }),
  spelling: z.object({
     questions: z.array(z.object({
        question: z.string().describe("A Korean sentence with a blank where a word should be (e.g., '이게 __이야?'). The user must choose the correct word."),
        options: z.array(z.string()).length(2).describe("Two word options to fill the blank. One is the correct spelling/word, the other is a common mistake (e.g., ['웬일', '왠일'])."),
        answer: z.string().describe('The correct word from the options.'),
    })).length(2).describe('An array of two spelling questions.'),
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

  - Reading Comprehension: A text of at least 5 to 7 sentences suitable for the student level, followed by two multiple-choice questions. Each question must have four unique options and one correct answer.
  - Vocabulary: A quiz about an idiom or proverb. Provide a definition as the question asking for the idiom/proverb, the idiom/proverb as the answer, the initial consonants (초성) of the answer as a hint, and an example sentence.
  - Spelling and Grammar: Two multiple-choice questions. Each question should present a sentence with a blank, and offer two words to choose from to fill the blank. One word must be the correct choice, and the other a common spelling or grammatical error. For example, a choice between '웬일' and '왠일'.

  Please structure your response in JSON format according to the output schema.

  Ensure the questions are challenging but attainable for the given student level. All the text and questions must be in Korean. 모든 문제는 국립국어원 표준어 규정을 준수할 것.`,
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

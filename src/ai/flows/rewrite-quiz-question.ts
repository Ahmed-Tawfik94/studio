'use server';

/**
 * @fileOverview A flow that rewrites a quiz question to provide a hint.
 *
 * - rewriteQuizQuestion - A function that rewrites the quiz question.
 * - RewriteQuizQuestionInput - The input type for the rewriteQuizQuestion function.
 * - RewriteQuizQuestionOutput - The return type for the rewriteQuizQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteQuizQuestionInputSchema = z.object({
  question: z.string().describe('The original quiz question.'),
  studentAnswer: z.string().describe('The student\u0027s incorrect answer.'),
  lessonContent: z.string().describe('The content of the lesson related to the quiz question.'),
});
export type RewriteQuizQuestionInput = z.infer<typeof RewriteQuizQuestionInputSchema>;

const RewriteQuizQuestionOutputSchema = z.object({
  rewrittenQuestion: z.string().describe('The rewritten quiz question providing a hint.'),
});
export type RewriteQuizQuestionOutput = z.infer<typeof RewriteQuizQuestionOutputSchema>;

export async function rewriteQuizQuestion(input: RewriteQuizQuestionInput): Promise<RewriteQuizQuestionOutput> {
  return rewriteQuizQuestionFlow(input);
}

const rewriteQuizQuestionPrompt = ai.definePrompt({
  name: 'rewriteQuizQuestionPrompt',
  input: {schema: RewriteQuizQuestionInputSchema},
  output: {schema: RewriteQuizQuestionOutputSchema},
  prompt: `You are an AI assistant helping students learn. A student has answered a quiz question incorrectly. Your job is to rewrite the question to provide a subtle hint, guiding the student towards the correct answer without giving it away directly.

Original Question: {{{question}}}
Student's Incorrect Answer: {{{studentAnswer}}}
Lesson Content: {{{lessonContent}}}

Rewrite the question to provide a hint:
`,
});

const rewriteQuizQuestionFlow = ai.defineFlow(
  {
    name: 'rewriteQuizQuestionFlow',
    inputSchema: RewriteQuizQuestionInputSchema,
    outputSchema: RewriteQuizQuestionOutputSchema,
  },
  async input => {
    const {output} = await rewriteQuizQuestionPrompt(input);
    return output!;
  }
);

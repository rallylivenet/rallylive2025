// SummarizeStageResults.ts
'use server';

/**
 * @fileOverview Summarizes the results of a rally stage using AI.
 *
 * - summarizeStageResults - A function that summarizes rally stage results.
 * - SummarizeStageResultsInput - The input type for the summarizeStageResults function.
 * - SummarizeStageResultsOutput - The return type for the summarizeStageResults function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeStageResultsInputSchema = z.object({
  stageName: z.string().describe('The name of the rally stage.'),
  stageResults: z.string().describe('Detailed results of the rally stage.'),
});

export type SummarizeStageResultsInput = z.infer<typeof SummarizeStageResultsInputSchema>;

const SummarizeStageResultsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the rally stage results.'),
});

export type SummarizeStageResultsOutput = z.infer<typeof SummarizeStageResultsOutputSchema>;

export async function summarizeStageResults(input: SummarizeStageResultsInput): Promise<SummarizeStageResultsOutput> {
  return summarizeStageResultsFlow(input);
}

const summarizeStageResultsPrompt = ai.definePrompt({
  name: 'summarizeStageResultsPrompt',
  input: {schema: SummarizeStageResultsInputSchema},
  output: {schema: SummarizeStageResultsOutputSchema},
  prompt: `You are an AI assistant specializing in summarizing rally stage results.

  Given the detailed results of a rally stage, provide a concise summary that captures the most important events, such as who won the stage, any notable incidents, and changes in the overall standings.

  Stage Name: {{{stageName}}}
  Stage Results: {{{stageResults}}}

  Summary:`, 
});

const summarizeStageResultsFlow = ai.defineFlow(
  {
    name: 'summarizeStageResultsFlow',
    inputSchema: SummarizeStageResultsInputSchema,
    outputSchema: SummarizeStageResultsOutputSchema,
  },
  async input => {
    const {output} = await summarizeStageResultsPrompt(input);
    return output!;
  }
);

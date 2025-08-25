
'use server';

/**
 * @fileOverview Summarizes a rally's overall results using AI.
 *
 * - summarizeRally - A function that summarizes rally results.
 * - SummarizeRallyInput - The input type for the summarizeRally function.
 * - SummarizeRallyOutput - The return type for the summarizeRally function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRallyInputSchema = z.object({
  rallyName: z.string().describe('The name of the rally.'),
  overallResults: z.string().describe('The overall results of the rally, typically in a structured format.'),
});

export type SummarizeRallyInput = z.infer<typeof SummarizeRallyInputSchema>;

const SummarizeRallyOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the rally, highlighting the winner, key events, and overall performance.'),
});

export type SummarizeRallyOutput = z.infer<typeof SummarizeRallyOutputSchema>;

export async function summarizeRally(input: SummarizeRallyInput): Promise<SummarizeRallyOutput> {
  return summarizeRallyFlow(input);
}

const summarizeRallyPrompt = ai.definePrompt({
  name: 'summarizeRallyPrompt',
  input: {schema: SummarizeRallyInputSchema},
  output: {schema: SummarizeRallyOutputSchema},
  prompt: `You are an expert rally commentator.

  Based on the provided overall results for the rally, generate an engaging and insightful summary.

  Your summary should cover:
  - The overall winner.
  - Any notable performances or surprises in the top standings.
  - The general performance of the top drivers.

  Rally Name: {{{rallyName}}}
  Overall Results:
  {{{overallResults}}}

  Provide the summary in a narrative format.`,
});

const summarizeRallyFlow = ai.defineFlow(
  {
    name: 'summarizeRallyFlow',
    inputSchema: SummarizeRallyInputSchema,
    outputSchema: SummarizeRallyOutputSchema,
  },
  async input => {
    const {output} = await summarizeRallyPrompt(input);
    return output!;
  }
);

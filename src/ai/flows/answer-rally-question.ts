
'use server';

/**
 * @fileOverview An AI flow to answer questions about a specific rally.
 *
 * - answerRallyQuestion - A function that answers a user's question based on rally data.
 * - AnswerRallyQuestionInput - The input type for the answerRallyQuestion function.
 * - AnswerRallyQuestionOutput - The return type for the answerRallyQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AnswerRallyQuestionInputSchema, AnswerRallyQuestionOutputSchema } from '@/lib/types';
import type { AnswerRallyQuestionInput, AnswerRallyQuestionOutput, StageResult, OverallResult, ItineraryItem } from '@/lib/types';

async function getRallyData(rid: string, stage_no: string): Promise<{ stageResults: StageResult[], overallResults: OverallResult[], itinerary: ItineraryItem[] }> {
    const [stageResultsResponse, overallResultsResponse, itineraryResponse] = await Promise.all([
        fetch(`https://www.rallylive.net/mobileapp/v1/json-stagetimes.php?rid=${rid}&stage_no=${stage_no}`),
        fetch(`https://www.rallylive.net/mobileapp/v1/json-overall.php?rid=${rid}&stage_no=${stage_no}`),
        fetch(`https://www.rallylive.net/mobileapp/v1/rally-itinerary.php?rid=${rid}`)
    ]);

    if (!stageResultsResponse.ok || !overallResultsResponse.ok || !itineraryResponse.ok) {
        throw new Error('Failed to fetch rally data');
    }

    const stageResults = await stageResultsResponse.json();
    const overallResults = await overallResultsResponse.json();
    const itinerary = await itineraryResponse.json();
    
    return { stageResults, overallResults, itinerary };
}


export async function answerRallyQuestion(input: AnswerRallyQuestionInput): Promise<AnswerRallyQuestionOutput> {
  return answerRallyQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerRallyQuestionPrompt',
  input: {schema: AnswerRallyQuestionInputSchema},
  output: {schema: AnswerRallyQuestionOutputSchema},
  prompt: `You are a rally expert and commentator.
  Your task is to answer the user's question about the rally based on the provided data.
  The data includes stage results, overall standings, and the rally itinerary.
  Provide a clear, concise, and friendly answer. Use markdown for formatting if needed.

  Rally Name: {{{rallyName}}}
  Current Stage: {{{stageName}}}
  User's Question: {{{question}}}

  Here is the data for the current stage (up to 10 results):
  {{#each stageResults}}
  - Rank {{rank}}: {{driver_surname}} ({{car_brand}}), Time: {{stage_time}}, Diff: {{diff_to_leader}}
  {{/each}}

  Here is the overall rally data (up to 10 results):
  {{#each overallResults}}
  - Rank {{rank}}: {{driver_surname}} ({{car_brand}}), Time: {{total_time}}, Diff: {{diff_to_leader}}
  {{/each}}
  
  Here is the rally itinerary:
  {{#each itinerary}}
  - {{#if no}}{{no}}: {{/if}}{{name}} - {{km}} km - Starts at {{time}}
  {{/each}}

  Answer:
  `,
});

const answerRallyQuestionFlow = ai.defineFlow(
  {
    name: 'answerRallyQuestionFlow',
    inputSchema: AnswerRallyQuestionInputSchema,
    outputSchema: AnswerRallyQuestionOutputSchema,
  },
  async (input) => {
    const { rid, stage_no, question, rallyName, stageName } = input;

    const { stageResults, overallResults, itinerary } = await getRallyData(rid, stage_no);

    const promptInput = {
        rallyName,
        stageName,
        question,
        stageResults: stageResults.slice(0, 10),
        overallResults: overallResults.slice(0, 10),
        itinerary: itinerary
    };
    
    const {output} = await prompt(promptInput);
    return output!;
  }
);

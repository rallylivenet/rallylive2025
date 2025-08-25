
'use server';

/**
 * @fileOverview An AI flow to answer questions about a specific rally.
 *
 * - answerRallyQuestion - A function that answers a user's question based on rally data.
 * - AnswerRallyQuestionInput - The input type for the answerRallyQuestion function.
 * - AnswerRallyQuestionOutput - The return type for the answerRallyQuestion function.
 */

import {ai} from '@/ai/genkit';
import { AnswerRallyQuestionInputSchema, AnswerRallyQuestionOutputSchema } from '@/lib/types';
import type { AnswerRallyQuestionInput, AnswerRallyQuestionOutput, StageResult, OverallResult, ItineraryItem } from '@/lib/types';

async function getRallyData(rid: string, current_stage_no: string): Promise<{ allStageResults: Record<string, StageResult[]>, overallResults: OverallResult[], itinerary: ItineraryItem[], rallyName: string }> {
    const itineraryResponse = await fetch(`https://www.rallylive.net/mobileapp/v1/rally-itinerary.php?rid=${rid}`);
    if (!itineraryResponse.ok) {
        throw new Error('Failed to fetch rally itinerary');
    }
    const itinerary: ItineraryItem[] = await itineraryResponse.json();
    const rallyHeader = itinerary.find(item => item.dbcode && item.dbcode.startsWith("h"));
    const rallyName = rallyHeader ? rallyHeader.name : "Rally";
    
    const overallResultsResponse = await fetch(`https://www.rallylive.net/mobileapp/v1/json-overall.php?rid=${rid}&stage_no=${current_stage_no}`);
     if (!overallResultsResponse.ok) {
        throw new Error('Failed to fetch overall results');
    }
    const overallResults = await overallResultsResponse.json();

    const allStageResults: Record<string, StageResult[]> = {};

    const stageResultPromises = itinerary
        .filter(item => parseInt(item.no, 10) > 0) // Only fetch for actual stages
        .map(async (stage) => {
            try {
                const response = await fetch(`https://www.rallylive.net/mobileapp/v1/json-stagetimes.php?rid=${rid}&stage_no=${stage.no}`);
                if (response.ok) {
                    const results: StageResult[] = await response.json();
                    if (results && results.length > 0) {
                       allStageResults[stage.no] = results;
                    }
                }
            } catch (e) {
                console.error(`Failed to fetch results for stage ${stage.no}`, e);
            }
        });

    await Promise.all(stageResultPromises);
    
    return { allStageResults, overallResults, itinerary, rallyName };
}


export async function answerRallyQuestion(input: AnswerRallyQuestionInput): Promise<AnswerRallyQuestionOutput> {
  return answerRallyQuestionFlow(input);
}

const answerRallyQuestionPrompt = ai.definePrompt({
  name: 'answerRallyQuestionPrompt',
  input: {schema: AnswerRallyQuestionInputSchema.extend({
      rallyName: z.string(),
      allStageResults: ai.defineSchema('allStageResults', {}),
      overallResults: ai.defineSchema('overallResults', []),
      itinerary: ai.defineSchema('itinerary', []),
  })},
  output: {schema: AnswerRallyQuestionOutputSchema},
  prompt: `You are a rally expert and commentator.
  Your task is to answer the user's question about the rally based on the provided data.
  The data includes results for all stages, current overall standings, and the rally itinerary.
  Provide a clear, concise, and friendly answer. Use markdown for formatting if needed.

  Rally Name: {{{rallyName}}}
  Current Stage: {{{stageName}}}
  User's Question: {{{question}}}

  Here is the overall rally data after the current stage (up to 10 results):
  {{#each overallResults}}
  - Rank {{rank}}: {{driver_surname}} ({{car_brand}}), Time: {{total_time}}, Diff: {{diff_to_leader}}
  {{/each}}

  Here are the results for each stage (top 5 for brevity):
  {{#each allStageResults}}
  Stage {{#if this.[0].no}}{{this.[0].no}}: {{/if}}{{#if this.[0].name}}{{this.[0].name}}{{/if}}
    {{#each this}}
    - Rank {{rank}}: {{driver_surname}}, Time: {{stage_time}}, Diff: {{diff_to_leader}}
    {{/each}}
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
    const { rid, stage_no, question, stageName } = input;

    const { allStageResults, overallResults, itinerary, rallyName } = await getRallyData(rid, stage_no);

    const promptInput = {
        ...input,
        rallyName,
        allStageResults: allStageResults,
        overallResults: overallResults.slice(0, 10),
        itinerary: itinerary
    };
    
    const {output} = await answerRallyQuestionPrompt(promptInput);
    return output!;
  }
);

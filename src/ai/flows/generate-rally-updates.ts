
'use server';

/**
 * @fileOverview Generates concise rally updates for push notifications.
 *
 * - generateRallyUpdate - A function that creates a notification message from rally data.
 * - RallyUpdateInput - The input type for the generateRallyUpdate function.
 * - RallyUpdateOutput - The return type for the generateRallyUpdate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { RallyUpdateInputSchema, RallyUpdateOutputSchema } from '@/lib/types';
import type { RallyUpdateInput, RallyUpdateOutput } from '@/lib/types';


export async function generateRallyUpdate(input: RallyUpdateInput): Promise<RallyUpdateOutput> {
  return generateRallyUpdateFlow(input);
}

const generateRallyUpdatePrompt = ai.definePrompt({
  name: 'generateRallyUpdatePrompt',
  input: {schema: RallyUpdateInputSchema},
  output: {schema: RallyUpdateOutputSchema},
  prompt: `You are a rally news reporter. Generate a very short, exciting push notification message based on the following rally update.
  The message should be no more than 150 characters.

  Rally Name: {{{rallyName}}}
  Stage: {{{stageName}}}
  Update Type: {{{updateType}}}

  {{#if stageWinner}}
  Stage Winner: {{{stageWinner.driverName}}}
  Stage Time: {{{stageWinner.time}}}
  {{/if}}

  {{#if overallLeader}}
  New Overall Leader: {{{overallLeader.driverName}}}
  Lead by: {{{overallLeader.leadBy}}}
  {{/if}}

  {{#if breakingNews}}
  Breaking News: {{{breakingNews}}}
  {{/if}}
  
  Notification Message:`,
});

const generateRallyUpdateFlow = ai.defineFlow(
  {
    name: 'generateRallyUpdateFlow',
    inputSchema: RallyUpdateInputSchema,
    outputSchema: RallyUpdateOutputSchema,
  },
  async input => {
    const {output} = await generateRallyUpdatePrompt(input);
    return output!;
  }
);

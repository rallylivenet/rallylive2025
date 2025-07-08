// src/ai/flows/generate-rally-updates.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate short, engaging rally updates using AI.
 *
 * - generateRallyUpdate - A function that generates rally updates.
 * - GenerateRallyUpdateInput - The input type for the generateRallyUpdate function.
 * - GenerateRallyUpdateOutput - The return type for the generateRallyUpdate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRallyUpdateInputSchema = z.object({
  rallyName: z.string().describe('The name of the rally.'),
  stageName: z.string().describe('The name of the stage.'),
  stageResults: z.string().describe('The results of the stage.'),
  leader: z.string().describe('The current leader of the rally.'),
  keyMoment: z.string().describe('A key moment from the rally.'),
});
export type GenerateRallyUpdateInput = z.infer<typeof GenerateRallyUpdateInputSchema>;

const GenerateRallyUpdateOutputSchema = z.object({
  update: z.string().describe('A short, engaging rally update.'),
});
export type GenerateRallyUpdateOutput = z.infer<typeof GenerateRallyUpdateOutputSchema>;

export async function generateRallyUpdate(input: GenerateRallyUpdateInput): Promise<GenerateRallyUpdateOutput> {
  return generateRallyUpdateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRallyUpdatePrompt',
  input: {schema: GenerateRallyUpdateInputSchema},
  output: {schema: GenerateRallyUpdateOutputSchema},
  prompt: `You are a rally commentator. Generate a short, engaging rally update, highlighting key moments and leader changes.

Rally Name: {{{rallyName}}}
Stage Name: {{{stageName}}}
Stage Results: {{{stageResults}}}
Leader: {{{leader}}}
Key Moment: {{{keyMoment}}}

Update:`,
});

const generateRallyUpdateFlow = ai.defineFlow(
  {
    name: 'generateRallyUpdateFlow',
    inputSchema: GenerateRallyUpdateInputSchema,
    outputSchema: GenerateRallyUpdateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


'use server';

import { answerRallyQuestion, type AnswerRallyQuestionInput } from '@/ai/flows/answer-rally-question';
import { AskAiAboutRallyFormSchema, type AskAiAboutRallyFormValues } from '@/lib/types';

interface RallyContext {
  rid: string;
  stage_no: string;
  rallyName: string;
  stageName: string;
}

export async function askAiAction(
  data: AskAiAboutRallyFormValues,
  context: RallyContext
): Promise<{ success: boolean; answer?: string; error?: string }> {
  
  const validation = AskAiAboutRallyFormSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, error: 'Invalid data provided.' };
  }

  const { question } = validation.data;
  const { rid, stage_no, rallyName, stageName } = context;
  
  try {
    const result = await answerRallyQuestion({ rid, stage_no, question, rallyName, stageName });
    if (result.answer) {
      return { success: true, answer: result.answer };
    }
    return { success: false, error: 'AI generation failed to produce an answer.' };
  } catch (error) {
    console.error('Error calling Genkit flow:', error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred during AI generation.' };
  }
}

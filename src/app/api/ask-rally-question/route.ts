
import { answerRallyQuestion } from '@/ai/flows/answer-rally-question';
import { AnswerRallyQuestionInputSchema } from '@/lib/types';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = AnswerRallyQuestionInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data provided.' }, { status: 400 });
    }

    const result = await answerRallyQuestion(validation.data);
    
    if (result.answer) {
      return NextResponse.json({ answer: result.answer });
    }
    
    return NextResponse.json({ error: 'AI generation failed to produce an answer.' }, { status: 500 });
  } catch (error) {
    console.error('Error in /api/ask-rally-question:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

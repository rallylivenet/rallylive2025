
import { generateRallyUpdate } from '@/ai/flows/generate-rally-updates';
import { RallyUpdateInputSchema } from '@/lib/types';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = RallyUpdateInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data provided.' }, { status: 400 });
    }

    const result = await generateRallyUpdate(validation.data);

    if (result.notification) {
      return NextResponse.json({ notification: result.notification });
    }
    
    return NextResponse.json({ error: 'AI generation failed to produce a notification.' }, { status: 500 });
  } catch (error) {
    console.error('Error in /api/generate-push:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

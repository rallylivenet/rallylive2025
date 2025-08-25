import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-stage-results.ts';
import '@/ai/flows/summarize-rally.ts';
import '@/ai/flows/generate-rally-updates.ts';
import '@/ai/flows/answer-rally-question.ts';

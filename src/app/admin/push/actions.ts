
'use server';

import { generateRallyUpdate, type RallyUpdateInput } from '@/ai/flows/generate-rally-updates';
import { AdminPushFormSchema, type AdminPushFormValues } from '@/lib/types';

export async function generatePushNotification(
  data: AdminPushFormValues
): Promise<{ success: boolean; notification?: string; error?: string }> {
  
  const validation = AdminPushFormSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, error: 'Invalid data provided.' };
  }

  const {
    rallyName,
    stageName,
    updateType,
    stageWinnerDriver,
    stageWinnerTime,
    overallLeaderDriver,
    overallLeaderLead,
    breakingNews,
  } = validation.data;

  const flowInput: RallyUpdateInput = {
    rallyName,
    stageName,
    updateType,
  };

  if (updateType === 'stage_winner' && stageWinnerDriver && stageWinnerTime) {
    flowInput.stageWinner = {
      driverName: stageWinnerDriver,
      time: stageWinnerTime,
    };
  }

  if (updateType === 'overall_leader_change' && overallLeaderDriver && overallLeaderLead) {
    flowInput.overallLeader = {
      driverName: overallLeaderDriver,
      leadBy: overallLeaderLead,
    };
  }

  if (updateType === 'breaking_news' && breakingNews) {
    flowInput.breakingNews = breakingNews;
  }
  
  try {
    const result = await generateRallyUpdate(flowInput);
    if (result.notification) {
      return { success: true, notification: result.notification };
    }
    return { success: false, error: 'AI generation failed to produce a notification.' };
  } catch (error) {
    console.error('Error calling Genkit flow:', error);
    return { success: false, error: 'An unexpected error occurred during AI generation.' };
  }
}

"use server";

import { generateRallyUpdate, type GenerateRallyUpdateInput } from "@/ai/flows/generate-rally-updates";

export async function getRallyUpdate(input: GenerateRallyUpdateInput) {
  try {
    const result = await generateRallyUpdate(input);
    return { success: true, update: result.update };
  } catch (error) {
    console.error("AI Error:", error);
    return { success: false, error: "Failed to generate rally update." };
  }
}

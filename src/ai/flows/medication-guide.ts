'use server';
/**
 * @fileOverview Provides detailed information about a specific medication.
 *
 * - getMedicationGuide - A function that returns a guide for a given medication.
 * - MedicationGuideInput - The input type for the getMedicationGuide function.
 * - MedicationGuideOutput - The return type for the getMedicationGuide function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MedicationGuideInputSchema = z.object({
  medicationName: z.string().describe('The name of the medication to get information about.'),
});
export type MedicationGuideInput = z.infer<typeof MedicationGuideInputSchema>;

const MedicationGuideOutputSchema = z.object({
  medicationName: z.string(),
  suggestedDosage: z.string().describe("A common or suggested dosage for the medication, e.g., '10mg' or '500mg'."),
  suggestedFrequency: z.string().describe("A common or suggested frequency for taking the medication, e.g., 'Once a day' or 'Twice a day'."),
  timing: z.string().describe('Recommended timing, e.g., "Morning or Evening".'),
  food: z.string().describe('Recommendation regarding food, e.g., "With or without food".'),
  advantages: z.array(z.string()).describe('List of key advantages or uses of the medication.'),
  disadvantages: z.array(z.string()).describe('List of potential disadvantages or side effects.'),
  duration: z.string().describe('Typical duration for taking the medication.'),
  disclaimer: z.string().describe('A disclaimer that this information is for educational purposes only and not a substitute for professional medical advice.'),
});
export type MedicationGuideOutput = z.infer<typeof MedicationGuideOutputSchema>;


export async function getMedicationGuide(input: MedicationGuideInput): Promise<MedicationGuideOutput> {
  return medicationGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicationGuidePrompt',
  input: { schema: MedicationGuideInputSchema },
  output: { schema: MedicationGuideOutputSchema },
  prompt: `
    You are a trusted medical information provider.
    For the medication "{{medicationName}}", provide a concise guide covering the following points:
    - Suggested Dosage: What is a common dosage for this medication?
    - Suggested Frequency: How often is this medication typically taken?
    - Timing: When is it best to take it? (e.g., Morning, Evening, with meals)
    - Food: Should it be taken with or without food?
    - Advantages: What are its primary benefits? List a few key points.
    - Disadvantages: What are the common side effects or disadvantages? List a few key points.
    - Duration: What is a typical duration for its use? (e.g., "As prescribed by your doctor", "For 7 days")

    Provide a clear and easy-to-understand response.
    Finally, always include a disclaimer: "This information is for educational purposes only and not a substitute for professional medical advice. Always consult your doctor or pharmacist."
  `,
});


const medicationGuideFlow = ai.defineFlow(
  {
    name: 'medicationGuideFlow',
    inputSchema: MedicationGuideInputSchema,
    outputSchema: MedicationGuideOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to get medication guide from the AI model.');
    }
    const validatedOutput = MedicationGuideOutputSchema.safeParse(output);
    if (!validatedOutput.success) {
      throw new Error(`AI model returned invalid data format. Errors: ${JSON.stringify(validatedOutput.error.issues)}`);
    }
    return validatedOutput.data;
  }
);

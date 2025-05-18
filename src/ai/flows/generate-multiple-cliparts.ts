
// use server'
'use server';
/**
 * @fileOverview Generates multiple clipart images from a single text prompt.
 *
 * - generateMultipleCliparts - A function that generates multiple clipart images based on a prompt.
 * - GenerateMultipleClipartsInput - The input type for the generateMultipleCliparts function.
 * - GenerateMultipleClipartsOutput - The return type for the generateMultipleCliparts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMultipleClipartsInputSchema = z.object({
  prompt: z.string().describe('The text prompt to use for generating the clipart images.'),
  numImages: z.number().describe('The number of clipart images to generate.').default(4),
});
export type GenerateMultipleClipartsInput = z.infer<
  typeof GenerateMultipleClipartsInputSchema
>;

const GenerateMultipleClipartsOutputSchema = z.object({
  images: z
    .array(z.string())
    .describe('An array of data URIs containing the generated clipart images.'),
});
export type GenerateMultipleClipartsOutput = z.infer<
  typeof GenerateMultipleClipartsOutputSchema
>;

export async function generateMultipleCliparts(
  input: GenerateMultipleClipartsInput
): Promise<GenerateMultipleClipartsOutput> {
  return generateMultipleClipartsFlow(input);
}

const generateMultipleClipartsFlow = ai.defineFlow(
  {
    name: 'generateMultipleClipartsFlow',
    inputSchema: GenerateMultipleClipartsInputSchema,
    outputSchema: GenerateMultipleClipartsOutputSchema,
  },
  async input => {
    const imagePromises = [];
    for (let i = 0; i < input.numImages; i++) {
      imagePromises.push(
        ai
          .generate({
            model: 'googleai/gemini-2.0-flash-exp',
            prompt: input.prompt,
            config: {
              responseModalities: ['TEXT', 'IMAGE'],
            },
          })
          .then(result => {
            if (!result.media?.url) {
              // This case should ideally be caught by the catch block below if ai.generate throws,
              // but it's a good safeguard.
              throw new Error(`Image generation attempt ${i + 1} failed to return a media URL.`);
            }
            return result.media.url;
          })
          // Adding a catch here for each individual promise
          // so that Promise.allSettled can correctly report it as 'rejected'.
          .catch(error => {
            console.error(`Error generating image ${i + 1} for prompt "${input.prompt}":`, error);
            // We need to throw the error (or a new one) so allSettled knows it's a rejection.
            // Or, return a specific marker for failure if we want to handle it differently.
            // For now, re-throwing ensures it's marked as 'rejected'.
            throw error; 
          })
      );
    }

    const results = await Promise.allSettled(imagePromises);
    const successfulImages: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (result.value) { // Ensure value is not null/undefined
          successfulImages.push(result.value);
        } else {
          // This case should ideally not happen if the .then(result => result.media.url) is sound
          console.warn(`Image generation attempt ${index + 1} for prompt "${input.prompt}" fulfilled but with no URL.`);
        }
      } else {
        // The error was already logged in the individual .catch block
        // console.error(`Image generation attempt ${index + 1} for prompt "${input.prompt}" failed:`, result.reason);
      }
    });

    return {images: successfulImages};
  }
);


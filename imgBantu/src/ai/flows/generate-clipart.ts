
'use server';

/**
 * @fileOverview Generates clipart images from a text prompt.
 *
 * - generateClipart - A function that generates clipart images from a text prompt.
 * - GenerateClipartInput - The input type for the generateClipart function.
 * - GenerateClipartOutput - The return type for the generateClipart function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateClipartInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate the clipart from.'),
});
export type GenerateClipartInput = z.infer<typeof GenerateClipartInputSchema>;

const GenerateClipartOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated clipart image.'),
});
export type GenerateClipartOutput = z.infer<typeof GenerateClipartOutputSchema>;

export async function generateClipart(input: GenerateClipartInput): Promise<GenerateClipartOutput> {
  return generateClipartFlow(input);
}

// The generateClipartPrompt object was removed as it was not being used by the flow.
// The flow directly calls ai.generate for image generation.

const generateClipartFlow = ai.defineFlow(
  {
    name: 'generateClipartFlow',
    inputSchema: GenerateClipartInputSchema,
    outputSchema: GenerateClipartOutputSchema,
  },
  async input => {
    // ai.generate for images primarily uses the input.prompt directly.
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: input.prompt, // Directly use the user's prompt for the image model
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // TEXT is needed even if we primarily use IMAGE
      },
    });
    if (!media?.url) {
      throw new Error('Image generation failed or did not return a media URL.');
    }
    return {imageUrl: media.url};
  }
);

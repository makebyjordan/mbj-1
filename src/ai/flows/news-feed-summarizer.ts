'use server';
/**
 * @fileOverview Un agente de IA que resume artículos de noticias relacionados con la creación de contenido, el desarrollo web y la marca.
 *
 * - summarizeNewsFeed - Una función que maneja el proceso de resumen de noticias.
 * - SummarizeNewsFeedInput - El tipo de entrada para la función summarizeNewsFeed.
 * - SummarizeNewsFeedOutput - El tipo de retorno para la función summarizeNewsFeed.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNewsFeedInputSchema = z.object({
  articleTitle: z.string().describe('El título del artículo de noticias.'),
  articleContent: z.string().describe('El contenido del artículo de noticias.'),
});
export type SummarizeNewsFeedInput = z.infer<typeof SummarizeNewsFeedInputSchema>;

const SummarizeNewsFeedOutputSchema = z.object({
  summary: z.string().describe('Un resumen conciso del artículo de noticias.'),
});
export type SummarizeNewsFeedOutput = z.infer<typeof SummarizeNewsFeedOutputSchema>;

export async function summarizeNewsFeed(input: SummarizeNewsFeedInput): Promise<SummarizeNewsFeedOutput> {
  return summarizeNewsFeedFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNewsFeedPrompt',
  input: {schema: SummarizeNewsFeedInputSchema},
  output: {schema: SummarizeNewsFeedOutputSchema},
  prompt: `Eres un experto resumidor de noticias especializado en creación de contenido, desarrollo web y branding. Tu respuesta debe estar en español.

Se te proporcionará el título y el contenido de un artículo de noticias. Tu tarea es crear un resumen conciso e informativo que capture los puntos clave del artículo.

Título del Artículo: {{{articleTitle}}}
Contenido del Artículo: {{{articleContent}}}

Resumen:`,
});

const summarizeNewsFeedFlow = ai.defineFlow(
  {
    name: 'summarizeNewsFeedFlow',
    inputSchema: SummarizeNewsFeedInputSchema,
    outputSchema: SummarizeNewsFeedOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

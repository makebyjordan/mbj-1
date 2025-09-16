'use server';
/**
 * @fileOverview An AI agent that summarizes news articles related to content creation, web development, and branding.
 *
 * - summarizeNewsFeed - A function that handles the news feed summarization process.
 * - SummarizeNewsFeedInput - The input type for the summarizeNewsFeed function.
 * - SummarizeNewsFeedOutput - The return type for the summarizeNewsFeed function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNewsFeedInputSchema = z.object({
  articleTitle: z.string().describe('The title of the news article.'),
  articleContent: z.string().describe('The content of the news article.'),
});
export type SummarizeNewsFeedInput = z.infer<typeof SummarizeNewsFeedInputSchema>;

const SummarizeNewsFeedOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the news article.'),
});
export type SummarizeNewsFeedOutput = z.infer<typeof SummarizeNewsFeedOutputSchema>;

export async function summarizeNewsFeed(input: SummarizeNewsFeedInput): Promise<SummarizeNewsFeedOutput> {
  return summarizeNewsFeedFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNewsFeedPrompt',
  input: {schema: SummarizeNewsFeedInputSchema},
  output: {schema: SummarizeNewsFeedOutputSchema},
  prompt: `You are an expert news summarizer specializing in content creation, web development, and branding.

You will be provided with the title and content of a news article. Your task is to create a concise and informative summary that captures the key points of the article.

Article Title: {{{articleTitle}}}
Article Content: {{{articleContent}}}

Summary:`,
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

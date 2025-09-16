"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Newspaper } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { summarizeNewsFeed } from "@/ai/flows/news-feed-summarizer";

const formSchema = z.object({
  articleTitle: z.string().min(10, {
    message: "Article title must be at least 10 characters.",
  }),
  articleContent: z.string().min(100, {
    message: "Article content must be at least 100 characters.",
  }),
});

export default function NewsSummarizer({ id }: { id: string }) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      articleTitle: "",
      articleContent: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummary("");
    try {
      const result = await summarizeNewsFeed(values);
      setSummary(result.summary);
      toast({
        title: "Success!",
        description: "Article summarized successfully.",
      });
    } catch (error) {
      console.error("Summarization error:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem summarizing the article. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <div className="text-center">
        <h2 className="section-title">AI News Summarizer</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Got an interesting article on web dev, branding, or content? Paste it below and let my AI assistant give you a quick summary.
        </p>
      </div>

      <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Summarize an Article</CardTitle>
            <CardDescription>Enter the title and content below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="articleTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Article Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., The Rise of AI in Modern Web Design" {...field} className="bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="articleContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Article Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste the full content of the article here..."
                          className="h-48 bg-background/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full primary-button-glow">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Newspaper className="mr-2 h-4 w-4" />}
                  Summarize
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="glass-card sticky top-24">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>The AI-generated summary will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert prose-p:text-muted-foreground min-h-[200px]">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                summary || <p className="text-center italic">Your summary is waiting...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

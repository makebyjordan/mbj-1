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
    message: "El título del artículo debe tener al menos 10 caracteres.",
  }),
  articleContent: z.string().min(100, {
    message: "El contenido del artículo debe tener al menos 100 caracteres.",
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
        title: "¡Éxito!",
        description: "Artículo resumido correctamente.",
      });
    } catch (error) {
      console.error("Error de resumen:", error);
      toast({
        variant: "destructive",
        title: "¡Oh, no! Algo salió mal.",
        description: "Hubo un problema al resumir el artículo. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <div className="text-center">
        <h2 className="section-title">Resumidor de Noticias con IA</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          ¿Tienes un artículo interesante sobre desarrollo web, branding o contenido? Pégalo a continuación y deja que mi asistente de IA te dé un resumen rápido.
        </p>
      </div>

      <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Resume un Artículo</CardTitle>
            <CardDescription>Introduce el título y el contenido a continuación.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="articleTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título del Artículo</FormLabel>
                      <FormControl>
                        <Input placeholder="ej., El auge de la IA en el diseño web moderno" {...field} className="bg-background/50" />
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
                      <FormLabel>Contenido del Artículo</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Pega el contenido completo del artículo aquí..."
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
                  Resumir
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="glass-card sticky top-24">
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
            <CardDescription>El resumen generado por IA aparecerá aquí.</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert prose-p:text-muted-foreground min-h-[200px]">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                summary || <p className="text-center italic">Tu resumen está esperando...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

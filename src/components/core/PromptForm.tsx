
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { createPrompt, updatePrompt, Prompt } from "@/services/prompts";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  description: z.string().min(1, "La descripción es requerida."),
  promptText: z.string().min(1, "El texto del prompt es requerido."),
});

type PromptFormProps = {
    prompt: Prompt | null;
    onSave: () => void;
}

export default function PromptForm({ prompt, onSave }: PromptFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      promptText: "",
    },
  });

  useEffect(() => {
    if (prompt) {
        form.reset(prompt);
    } else {
        form.reset({
            title: "",
            description: "",
            promptText: "",
        });
    }
  }, [prompt, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        if (prompt && prompt.id) {
            await updatePrompt(prompt.id, values);
        } else {
            await createPrompt(values);
        }
        onSave();
    } catch (error) {
        console.error("Error saving prompt:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar el prompt. Revisa la consola para más detalles.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                    <Input placeholder="Prompt para generar logo" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Describe para qué sirve este prompt..."
                    className="h-24 bg-background/50"
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="promptText"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Texto del Prompt</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Pega aquí el prompt completo..."
                    className="h-40 bg-background/50 font-mono"
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="primary-button-glow">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Guardar Prompt
                </Button>
            </div>
        </form>
    </Form>
  );
}

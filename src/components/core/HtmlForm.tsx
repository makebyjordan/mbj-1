
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
import { createHtml, updateHtml, HtmlPage } from "@/services/htmls";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  htmlContent: z.string().min(1, "El contenido HTML es requerido."),
});

type HtmlFormProps = {
    htmlPage: HtmlPage | null;
    onSave: () => void;
}

export default function HtmlForm({ htmlPage, onSave }: HtmlFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      htmlContent: "",
    },
  });

  useEffect(() => {
    if (htmlPage) {
        form.reset(htmlPage);
    } else {
        form.reset({
            title: "",
            htmlContent: "",
        });
    }
  }, [htmlPage, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        if (htmlPage && htmlPage.id) {
            await updateHtml(htmlPage.id, values);
        } else {
            await createHtml(values);
        }
        onSave();
    } catch (error) {
        console.error("Error saving HTML page:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar la página HTML.",
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
                <FormLabel>Título de la Página</FormLabel>
                <FormControl>
                    <Input placeholder="Mi nueva página HTML" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="htmlContent"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Contenido HTML</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Pega aquí el código HTML completo..."
                    className="h-64 bg-background/50 font-mono"
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
                    Guardar Página HTML
                </Button>
            </div>
        </form>
    </Form>
  );
}

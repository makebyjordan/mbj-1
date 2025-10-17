
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { createN8NTemplate, updateN8NTemplate, N8NTemplate } from "@/services/n8n-templates";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  jsonContent: z.string().min(1, "El contenido JSON es requerido."),
  htmlContent: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
});

type N8NTemplateFormProps = {
    template: N8NTemplate | null;
    onSave: () => void;
}

export default function N8NTemplateForm({ template, onSave }: N8NTemplateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      jsonContent: "",
      htmlContent: "",
      url: "",
    },
  });

  useEffect(() => {
    if (template) {
        form.reset(template);
    } else {
        form.reset({
            title: "",
            jsonContent: "",
            htmlContent: "",
            url: "",
        });
    }
  }, [template, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        // Basic JSON validation
        JSON.parse(values.jsonContent);

        if (template && template.id) {
            await updateN8NTemplate(template.id, values);
        } else {
            await createN8NTemplate(values);
        }
        onSave();
    } catch (error: any) {
        console.error("Error saving N8N template:", error);
        const description = error.message.includes('JSON') 
            ? "El contenido no es un JSON válido. Por favor, revísalo."
            : "No se pudo guardar la plantilla. Revisa la consola para más detalles.";
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: description,
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
                <FormLabel>Título de la Plantilla</FormLabel>
                <FormControl>
                    <Input placeholder="Automatización de bienvenida" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="jsonContent"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Contenido JSON</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Pega aquí el código JSON de tu plantilla N8N..."
                    className="h-48 bg-background/50 font-mono"
                    {...field}
                    />
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
                  <FormLabel>Contenido HTML (Opcional)</FormLabel>
                  <FormControl>
                      <Textarea
                        placeholder="Pega tu código HTML aquí para la página de 'Aprender'..."
                        className="h-48 bg-background/50 font-mono"
                        {...field}
                      />
                  </FormControl>
                   <FormDescription>
                    Este contenido se mostrará en una página separada de aprendizaje.
                  </FormDescription>
                  <FormMessage />
                  </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Externa (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://ejemplo.com/documentacion"
                      {...field}
                      className="bg-background/50"
                    />
                  </FormControl>
                  <FormDescription>
                    Añade un enlace a documentación o un recurso externo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="primary-button-glow">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Guardar Plantilla
                </Button>
            </div>
        </form>
    </Form>
  );
}

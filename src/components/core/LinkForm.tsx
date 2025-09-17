
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
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { createLink, updateLink, LinkItem } from "@/services/links";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  url: z.string().url("Debe ser una URL válida."),
  tag: z.string().min(1, "La etiqueta es requerida."),
});

type LinkFormProps = {
    link: LinkItem | null;
    onSave: () => void;
}

export default function LinkForm({ link, onSave }: LinkFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      tag: "",
    },
  });

  useEffect(() => {
    if (link) {
        form.reset(link);
    } else {
        form.reset({
            title: "",
            url: "",
            tag: "",
        });
    }
  }, [link, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        if (link && link.id) {
            await updateLink(link.id, values);
        } else {
            await createLink(values);
        }
        onSave();
    } catch (error) {
        console.error("Error saving link:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar el enlace. Revisa la consola para más detalles.",
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
                    <Input placeholder="Nombre del enlace" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
                <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                    <Input placeholder="https://ejemplo.com" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Etiqueta</FormLabel>
                <FormControl>
                    <Input placeholder="Diseño, Inspiración, etc." {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="primary-button-glow">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Guardar Enlace
                </Button>
            </div>
        </form>
    </Form>
  );
}

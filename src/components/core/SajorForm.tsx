
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
import { createSajorItem, updateSajorItem, SajorItem } from "@/services/sajor";

const formSchema = z.object({
  title: z.string().optional(),
  url: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

type SajorFormProps = {
    item: SajorItem | null;
    onSave: () => void;
}

export default function SajorForm({ item, onSave }: SajorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (item) {
        form.reset(item);
    } else {
        form.reset({
            title: "",
            url: "",
            description: "",
            notes: "",
        });
    }
  }, [item, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        if (item && item.id) {
            await updateSajorItem(item.id, values);
        } else {
            await createSajorItem(values);
        }
        onSave();
    } catch (error) {
        console.error("Error saving Sajor item:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar el elemento.",
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
                <FormLabel>Título (Opcional)</FormLabel>
                <FormControl>
                    <Input placeholder="Nombre del recurso" {...field} className="bg-background/50" />
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
                <FormLabel>URL (Opcional)</FormLabel>
                <FormControl>
                    <Input type="url" placeholder="https://ejemplo.com" {...field} className="bg-background/50" />
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
                <FormLabel>Descripción (Opcional)</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Breve descripción del recurso..."
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
            name="notes"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Notas (Opcional)</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Anotaciones personales..."
                    className="h-32 bg-background/50"
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
                    Guardar
                </Button>
            </div>
        </form>
    </Form>
  );
}

    
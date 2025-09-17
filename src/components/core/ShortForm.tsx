
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
import { createShort, updateShort, Short } from "@/services/shorts";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  youtubeUrl: z.string().url("Debe ser una URL de YouTube válida."),
});

type ShortFormProps = {
    short: Short | null;
    onSave: () => void;
}

export default function ShortForm({ short, onSave }: ShortFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      youtubeUrl: "",
    },
  });

  useEffect(() => {
    if (short) {
        form.reset(short);
    } else {
        form.reset({
            title: "",
            youtubeUrl: "",
        });
    }
  }, [short, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        if (short && short.id) {
            await updateShort(short.id, values);
        } else {
            await createShort(values);
        }
        onSave();
    } catch (error) {
        console.error("Error saving short:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar el short. Revisa que la URL sea correcta.",
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
                <FormLabel>Título del Short</FormLabel>
                <FormControl>
                    <Input placeholder="Mi nuevo short increíble" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="youtubeUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>URL de YouTube</FormLabel>
                <FormControl>
                    <Input placeholder="https://www.youtube.com/shorts/..." {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="primary-button-glow">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Guardar Short
                </Button>
            </div>
        </form>
    </Form>
  );
}

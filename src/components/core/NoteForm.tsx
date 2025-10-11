
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
import { createNote, updateNote, Note } from "@/services/notes";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  description: z.string().optional(),
});

type NoteFormProps = {
    note: Note | null;
    onSave: () => void;
}

export default function NoteForm({ note, onSave }: NoteFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (note) {
        form.reset(note);
    } else {
        form.reset({
            title: "",
            description: "",
        });
    }
  }, [note, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        if (note && note.id) {
            await updateNote(note.id, values);
        } else {
            await createNote(values);
        }
        onSave();
    } catch (error) {
        console.error("Error saving note:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar la nota.",
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
                <FormLabel>Título de la Nota</FormLabel>
                <FormControl>
                    <Input placeholder="Idea para nuevo proyecto" {...field} className="bg-background/50" />
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
                <FormLabel>Contenido</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Desarrollar una app que..."
                    className="h-40 bg-background/50"
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
                    Guardar Nota
                </Button>
            </div>
        </form>
    </Form>
  );
}

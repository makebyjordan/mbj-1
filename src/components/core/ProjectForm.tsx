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
import { useState } from "react";
import { createProject, updateProject, Project } from "@/services/projects";

const formSchema = z.object({
  title: z.string().min(3, { message: "El título debe tener al menos 3 caracteres." }),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }),
  imageUrl: z.string().url({ message: "Por favor, introduce una URL de imagen válida." }),
  imageHint: z.string().optional(),
  url: z.string().url({ message: "Por favor, introduce una URL de proyecto válida." }).optional().or(z.literal('')),
});

type ProjectFormProps = {
    project: Project | null;
    onSave: () => void;
}

export default function ProjectForm({ project, onSave }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      imageUrl: project?.imageUrl || "https://picsum.photos/seed/new-project/600/400",
      imageHint: project?.imageHint || "",
      url: project?.url || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        if (project && project.id) {
            await updateProject(project.id, values);
        } else {
            await createProject(values);
        }
        onSave();
    } catch (error) {
        console.error("Error saving project:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar el proyecto. Inténtalo de nuevo.",
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
                    <Input placeholder="Nombre del proyecto" {...field} className="bg-background/50" />
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
                    placeholder="Describe tu proyecto..."
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
            name="imageUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>URL de la Imagen</FormLabel>
                <FormControl>
                    <Input placeholder="https://picsum.photos/seed/project/600/400" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="imageHint"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Pista de la Imagen (para IA, 1-2 palabras)</FormLabel>
                <FormControl>
                    <Input placeholder="ej. website design" {...field} className="bg-background/50" />
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
                <FormLabel>URL del Proyecto</FormLabel>
                <FormControl>
                    <Input placeholder="https://mi-proyecto.com" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="primary-button-glow">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Guardar Cambios
                </Button>
            </div>
        </form>
    </Form>
  );
}


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
import { createTeamItem, updateTeamItem, TeamItem } from "@/services/team";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  position: z.string().min(1, "La posición es requerida."),
  bio: z.string().optional(),
  imageUrl: z.string().url("Debe ser una URL de imagen válida.").optional().or(z.literal('')),
  email: z.string().email("Debe ser un email válido.").optional().or(z.literal('')),
  linkedinUrl: z.string().url("Debe ser una URL de LinkedIn válida.").optional().or(z.literal('')),
  portfolioUrl: z.string().url("Debe ser una URL de portafolio válida.").optional().or(z.literal('')),
});

type TeamFormProps = {
    item: TeamItem | null;
    onSave: () => void;
}

export default function TeamForm({ item, onSave }: TeamFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      position: "",
      bio: "",
      imageUrl: "",
      email: "",
      linkedinUrl: "",
      portfolioUrl: "",
    },
  });

  useEffect(() => {
    if (item) {
        form.reset(item);
    } else {
        form.reset({
            name: "",
            position: "",
            bio: "",
            imageUrl: "",
            email: "",
            linkedinUrl: "",
            portfolioUrl: "",
        });
    }
  }, [item, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        if (item && item.id) {
            await updateTeamItem(item.id, values);
        } else {
            await createTeamItem(values);
        }
        onSave();
    } catch (error) {
        console.error("Error saving team item:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar el elemento del equipo.",
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
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                        <Input placeholder="Nombre completo" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Posición / Cargo</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Desarrollador Frontend" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Biografía Corta</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Una breve descripción sobre la persona..." {...field} className="bg-background/50" />
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
                    <FormLabel>URL de la Imagen de Perfil</FormLabel>
                    <FormControl>
                        <Input type="url" placeholder="https://ejemplo.com/foto.jpg" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email (Opcional)</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="contacto@ejemplo.com" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>URL de LinkedIn (Opcional)</FormLabel>
                    <FormControl>
                        <Input type="url" placeholder="https://linkedin.com/in/usuario" {...field} className="bg-background/50" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="portfolioUrl"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>URL del Portafolio (Opcional)</FormLabel>
                    <FormControl>
                        <Input type="url" placeholder="https://miportafolio.com" {...field} className="bg-background/50" />
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


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
import { createDesign, updateDesign, Design } from "@/services/designs";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  imageUrl: z.string().url("Debe ser una URL de imagen válida."),
});

type DesignFormProps = {
    design: Design | null;
    onSave: () => void;
}

export default function DesignForm({ design, onSave }: DesignFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (design) {
        form.reset(design);
    } else {
        form.reset({
            title: "",
            imageUrl: "",
        });
    }
  }, [design, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        if (design && design.id) {
            await updateDesign(design.id, values);
        } else {
            await createDesign(values);
        }
        onSave();
    } catch (error) {
        console.error("Error saving design:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar el diseño. Revisa la consola para más detalles.",
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
                <FormLabel>Título del Diseño</FormLabel>
                <FormControl>
                    <Input placeholder="Logo para cafetería" {...field} className="bg-background/50" />
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
                    <Input placeholder="https://ejemplo.com/mi-diseno.png" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="primary-button-glow">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Guardar Diseño
                </Button>
            </div>
        </form>
    </Form>
  );
}

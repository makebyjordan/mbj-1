
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
import { saveResultado, Resultado } from "@/services/resultados";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  prompt: z.string().min(1, "El prompt es requerido."),
  imageUrl: z.string().url("Debe ser una URL de imagen válida."),
  imageUrl2: z.string().url("URL inválida.").optional().or(z.literal('')),
  imageUrl3: z.string().url("URL inválida.").optional().or(z.literal('')),
});

type ResultadoFormProps = {
    resultado: Resultado | null;
    onSave: () => void;
}

export default function ResultadoForm({ resultado, onSave }: ResultadoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      prompt: "",
      imageUrl: "",
      imageUrl2: "",
      imageUrl3: "",
    },
  });

  useEffect(() => {
    if (resultado) {
        form.reset(resultado);
    } else {
        form.reset({
            title: "",
            prompt: "",
            imageUrl: "",
            imageUrl2: "",
            imageUrl3: "",
        });
    }
  }, [resultado, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        if (resultado && resultado.id) {
            await saveResultado({ ...values, id: resultado.id });
        } else {
            await saveResultado(values);
        }
        onSave();
    } catch (error) {
        console.error("Error saving resultado:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar el resultado. Revisa la consola para más detalles.",
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
                <FormLabel>Título del Resultado</FormLabel>
                <FormControl>
                    <Input placeholder="Dragón en el bosque" {...field} className="bg-background/50" />
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
                <FormLabel>URL de la Imagen Principal</FormLabel>
                <FormControl>
                    <Input placeholder="https://ejemplo.com/resultado.png" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="imageUrl2"
            render={({ field }) => (
                <FormItem>
                <FormLabel>URL de la Imagen 2 (Opcional)</FormLabel>
                <FormControl>
                    <Input placeholder="https://ejemplo.com/resultado-2.png" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="imageUrl3"
            render={({ field }) => (
                <FormItem>
                <FormLabel>URL de la Imagen 3 (Opcional)</FormLabel>
                <FormControl>
                    <Input placeholder="https://ejemplo.com/resultado-3.png" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Prompt Utilizado</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="El prompt que generó la imagen..."
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
                    Guardar Resultado
                </Button>
            </div>
        </form>
    </Form>
  );
}

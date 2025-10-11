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
import { createN8NServer, updateN8NServer, N8NServer } from "@/services/n8n-servers";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  url: z.string().url("Debe ser una URL válida."),
  code: z.string().min(4, "El código debe tener al menos 4 caracteres."),
});

type N8NServerFormProps = {
    server: N8NServer | null;
    onSave: () => void;
}

export default function N8NServerForm({ server, onSave }: N8NServerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      code: "",
    },
  });

  useEffect(() => {
    if (server) {
        form.reset(server);
    } else {
        form.reset({
            title: "",
            url: "",
            code: "",
        });
    }
  }, [server, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        if (server && server.id) {
            await updateN8NServer(server.id, values);
        } else {
            await createN8NServer(values);
        }
        onSave();
    } catch (error) {
        console.error("Error saving N8N server:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar el servidor N8N.",
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
                <FormLabel>Título del Servidor</FormLabel>
                <FormControl>
                    <Input placeholder="Servidor Principal" {...field} className="bg-background/50" />
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
                <FormLabel>URL del Servidor N8N</FormLabel>
                <FormControl>
                    <Input type="url" placeholder="https://mi-n8n.ejemplo.com" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Código de Acceso</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="primary-button-glow">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Guardar Servidor
                </Button>
            </div>
        </form>
    </Form>
  );
}

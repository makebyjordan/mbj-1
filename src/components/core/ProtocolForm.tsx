
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
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
import { createProtocol, updateProtocol, Protocol } from "@/services/protocols";
import { Separator } from "../ui/separator";

const ProtocolStepSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  steps: z.array(ProtocolStepSchema).optional(),
});

type ProtocolFormProps = {
    protocol: Protocol | null;
    onSave: () => void;
}

export default function ProtocolForm({ protocol, onSave }: ProtocolFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      steps: [],
    },
  });
  
  const { fields: stepsFields, append: appendStep, remove: removeStep } = useFieldArray({
    control: form.control,
    name: "steps",
  });

  useEffect(() => {
    if (protocol) {
        form.reset(protocol);
    } else {
        form.reset({
            title: "",
            steps: [],
        });
    }
  }, [protocol, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        if (protocol && protocol.id) {
            await updateProtocol(protocol.id, values);
        } else {
            await createProtocol(values);
        }
        onSave();
    } catch (error) {
        console.error("Error saving protocol:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar el protocolo.",
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
                <FormLabel>Título del Protocolo</FormLabel>
                <FormControl>
                    <Input placeholder="Protocolo de bienvenida de cliente" {...field} className="bg-background/50" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <Separator />
            
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Pasos del Protocolo</h3>
                {stepsFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg relative space-y-4 mb-4 bg-background/30">
                    <Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => removeStep(index)}><Trash2 className="h-4 w-4" /></Button>
                    <FormField control={form.control} name={`steps.${index}.title`} render={({ field }) => ( <FormItem><FormLabel>Paso {index + 1}</FormLabel><FormControl><Input placeholder="Título del paso" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name={`steps.${index}.description`} render={({ field }) => ( <FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea rows={3} placeholder="Descripción detallada del paso" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name={`steps.${index}.imageUrl`} render={({ field }) => ( <FormItem><FormLabel>URL de Imagen (Opcional)</FormLabel><FormControl><Input placeholder="https://ejemplo.com/imagen_paso.jpg" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                ))}
                <Button type="button" variant="outline" className="mt-2" onClick={() => appendStep({ title: "", description: "", imageUrl: "" })}><PlusCircle className="mr-2 h-4 w-4" />Añadir Paso</Button>
            </div>
            
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="primary-button-glow">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Guardar Protocolo
                </Button>
            </div>
        </form>
    </Form>
  );
}


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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { createTool, updateTool, Tool } from "@/services/tools";
import { createToolCategory, ToolCategory } from "@/services/toolCategories";
import CreatableSelect from 'react-select/creatable';

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  description: z.string().optional(),
  imageUrl: z.string().url("Debe ser una URL de imagen válida.").optional().or(z.literal('')),
  url: z.string().url("Debe ser una URL válida.").optional().or(z.literal('')),
  price: z.coerce.number().optional(),
  paymentDay: z.coerce.number().min(1).max(31).optional(),
  isPaid: z.boolean().default(false),
  categoryIds: z.array(z.string()).optional(),
});

type ToolFormValues = z.infer<typeof formSchema>;

type ToolFormProps = {
    tool: Tool | null;
    onSave: () => void;
    onCategoryCreated: () => void;
    allCategories: ToolCategory[];
}

export default function ToolForm({ tool, onSave, onCategoryCreated, allCategories }: ToolFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ToolFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      url: "",
      price: 0,
      paymentDay: 1,
      isPaid: false,
      categoryIds: [],
    },
  });

  useEffect(() => {
    if (tool) {
        form.reset({
            ...tool,
            price: tool.price || 0,
            paymentDay: tool.paymentDay || 1,
        });
    } else {
        form.reset({
            title: "",
            description: "",
            imageUrl: "",
            url: "",
            price: 0,
            paymentDay: 1,
            isPaid: false,
            categoryIds: [],
        });
    }
  }, [tool, form]);

  const categoryOptions = allCategories.map(cat => ({ value: cat.id!, label: cat.name }));

  const handleCreateCategory = async (inputValue: string) => {
    setIsLoading(true);
    try {
        const newCategoryId = await createToolCategory({ name: inputValue });
        onCategoryCreated(); // This will refetch categories in the dashboard
        const newOption = { value: newCategoryId, label: inputValue };
        const currentCategoryIds = form.getValues('categoryIds') || [];
        form.setValue('categoryIds', [...currentCategoryIds, newCategoryId]);
    } catch(e) {
        toast({ variant: "destructive", title: "Error", description: "No se pudo crear la categoría." });
    } finally {
        setIsLoading(false);
    }
  };

  async function onSubmit(values: ToolFormValues) {
    setIsLoading(true);
    try {
        if (tool && tool.id) {
            await updateTool(tool.id, values);
        } else {
            await createTool(values);
        }
        onSave();
    } catch (error) {
        console.error("Error saving tool:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar la herramienta.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  const selectedCategories = categoryOptions.filter(option => form.watch('categoryIds')?.includes(option.value));

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="title" render={({ field }) => ( <FormItem> <FormLabel>Título</FormLabel> <FormControl> <Input placeholder="Nombre de la herramienta" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Descripción</FormLabel> <FormControl> <Textarea placeholder="Para qué sirve esta herramienta..." {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="imageUrl" render={({ field }) => ( <FormItem> <FormLabel>URL de Imagen</FormLabel> <FormControl> <Input placeholder="https://ejemplo.com/logo.png" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="url" render={({ field }) => ( <FormItem> <FormLabel>URL de la Herramienta</FormLabel> <FormControl> <Input placeholder="https://ejemplo.com" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => ( <FormItem> <FormLabel>Precio (€)</FormLabel> <FormControl> <Input type="number" step="0.01" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="paymentDay" render={({ field }) => ( <FormItem> <FormLabel>Día de Pago</FormLabel> <FormControl> <Input type="number" min="1" max="31" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            </div>

            <FormField control={form.control} name="categoryIds" render={({ field }) => (
                <FormItem>
                    <FormLabel>Categorías de Uso</FormLabel>
                    <FormControl>
                        <CreatableSelect
                            isMulti
                            isClearable
                            isDisabled={isLoading}
                            isLoading={isLoading}
                            options={categoryOptions}
                            value={selectedCategories}
                            onChange={(selectedOptions) => {
                                const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                field.onChange(selectedIds);
                            }}
                            onCreateOption={handleCreateCategory}
                            placeholder="Selecciona o crea categorías..."
                            formatCreateLabel={(inputValue) => `Crear "${inputValue}"`}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}/>

            <FormField control={form.control} name="isPaid" render={({ field }) => ( <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"> <FormControl> <Checkbox checked={field.value} onCheckedChange={field.onChange} /> </FormControl> <div className="space-y-1 leading-none"> <FormLabel>Pagado</FormLabel> <FormMessage /> </div> </FormItem> )} />

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="primary-button-glow">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Guardar Herramienta
                </Button>
            </div>
        </form>
    </Form>
  );
}


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
import { createLinkCard, updateLinkCard, LinkCard } from "@/services/link-cards";
import { getImages, ImageData } from "@/services/images";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  imageUrl: z.string().url("Debe seleccionar una imagen."),
});

type LinkCardFormProps = {
    card: LinkCard | null;
    onSave: () => void;
}

export default function LinkCardForm({ card, onSave }: LinkCardFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [images, setImages] = useState<ImageData[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    async function fetchInitialData() {
        try {
            const availableImages = await getImages();
            setImages(availableImages);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar las imágenes de la galería." });
        } finally {
            setIsDataLoading(false);
        }
    }
    fetchInitialData();
  }, [toast]);
  
  useEffect(() => {
    if (card) {
        form.reset(card);
    } else {
        form.reset({ title: "", imageUrl: "" });
    }
  }, [card, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        if (card && card.id) {
            await updateLinkCard(card.id, values);
        } else {
            await createLinkCard(values);
        }
        onSave();
    } catch (error) {
        console.error("Error saving link card:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar la categoría. Revisa la consola para más detalles.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  if (isDataLoading) {
    return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Título de la Categoría</FormLabel>
                <FormControl>
                    <Input placeholder="Herramientas de Diseño" {...field} className="bg-background/50" />
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
                  <FormLabel>Imagen de la Categoría</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="mt-2">
                      <ScrollArea className="h-72 w-full rounded-md border">
                        <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                          {images.map((image) => (
                             <FormItem key={image.id} className="relative">
                               <FormControl><RadioGroupItem value={image.url} className="peer sr-only" /></FormControl>
                                <FormLabel className="cursor-pointer">
                                  <Image
                                    src={image.url}
                                    alt={image.name}
                                    width={200}
                                    height={200}
                                    className="rounded-md object-cover aspect-square transition-all peer-aria-checked:ring-2 peer-aria-checked:ring-primary peer-aria-checked:ring-offset-2"
                                  />
                                </FormLabel>
                             </FormItem>
                          ))}
                        </div>
                      </ScrollArea>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="primary-button-glow">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Guardar Categoría
                </Button>
            </div>
        </form>
    </Form>
  );
}

    
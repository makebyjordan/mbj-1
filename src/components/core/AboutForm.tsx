
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
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
import { getAboutContent, updateAboutContent, AboutContentData } from "@/services/about";
import { getImages, ImageData } from "@/services/images";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";

const aboutFormSchema = z.object({
  title: z.string().min(1, "El título es requerido."),
  description: z.string().min(1, "La descripción es requerida."),
  imageUrl: z.string().url("Debe ser una URL válida."),
});

type AboutFormProps = {
    onSave: () => void;
}

export default function AboutForm({ onSave }: AboutFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof aboutFormSchema>>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [aboutContent, availableImages] = await Promise.all([
            getAboutContent(),
            getImages()
        ]);
        if (aboutContent) {
            form.reset(aboutContent);
        }
        setImages(availableImages);
      } catch (error) {
        console.error("Error fetching about data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los datos de 'Sobre Mí'.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [form, toast]);

  async function onSubmit(values: z.infer<typeof aboutFormSchema>) {
    setIsSaving(true);
    try {
        await updateAboutContent(values as AboutContentData);
        onSave();
    } catch (error) {
        console.error("Error saving about content:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar el contenido de 'Sobre Mí'.",
        });
    } finally {
        setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Título de la Sección</FormLabel>
                  <FormControl>
                      <Input
                        placeholder="Sobre Mí"
                        className="bg-background/50"
                        {...field}
                      />
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
                  <FormLabel>Descripción / Historia</FormLabel>
                  <FormControl>
                      <Textarea
                        placeholder="¡Hola! Soy Jordan..."
                        className="h-40 bg-background/50"
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
                  <FormLabel>Imagen</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="mt-2"
                    >
                      <ScrollArea className="h-72 w-full rounded-md border">
                        <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                          {images.map((image) => (
                             <FormItem key={image.id} className="relative">
                               <FormControl>
                                 <RadioGroupItem value={image.url} className="peer sr-only" />
                               </FormControl>
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
                <Button type="submit" disabled={isSaving} className="primary-button-glow">
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Guardar Cambios
                </Button>
            </div>
        </form>
    </Form>
  );
}

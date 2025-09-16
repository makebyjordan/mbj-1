
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Trash2 } from "lucide-react";
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
import { getHeroContent, updateHeroContent, HeroContentData } from "@/services/hero";
import { getImages, ImageData } from "@/services/images";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const heroFormSchema = z.object({
  description: z.string().min(1, "La descripción es requerida."),
  backgroundImageUrl: z.string().url("Debe ser una URL válida."),
  buttons: z.array(z.object({
    text: z.string().min(1, "El texto del botón es requerido."),
    url: z.string().min(1, "La URL del botón es requerida."),
    variant: z.enum(["primary", "outline"]),
  })).max(2, "Puedes tener un máximo de 2 botones."),
});

type HeroFormProps = {
    onSave: () => void;
}

export default function HeroForm({ onSave }: HeroFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof heroFormSchema>>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: {
      description: "",
      backgroundImageUrl: "",
      buttons: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "buttons",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [heroContent, availableImages] = await Promise.all([
            getHeroContent(),
            getImages()
        ]);
        if (heroContent) {
            form.reset(heroContent);
        }
        setImages(availableImages);
      } catch (error) {
        console.error("Error fetching hero data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los datos del hero.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [form, toast]);

  async function onSubmit(values: z.infer<typeof heroFormSchema>) {
    setIsSaving(true);
    try {
        await updateHeroContent(values as HeroContentData);
        onSave();
    } catch (error) {
        console.error("Error saving hero content:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar el contenido del hero.",
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
              name="description"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                      <Textarea
                        placeholder="Una mente creativa forjando experiencias digitales..."
                        className="h-24 bg-background/50"
                        {...field}
                      />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />

            <div>
              <FormLabel>Botones (Máximo 2)</FormLabel>
              <div className="space-y-4 mt-2">
                {fields.map((field, index) => (
                    <Card key={field.id} className="p-4 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name={`buttons.${index}.text`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Texto del Botón</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Ver Mi Trabajo" className="bg-background/50" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`buttons.${index}.url`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL del Botón</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="/#portfolio" className="bg-background/50" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <FormField
                            control={form.control}
                            name={`buttons.${index}.variant`}
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormLabel>Estilo del Botón</FormLabel>
                                     <FormControl>
                                        <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex gap-4 mt-2"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                <RadioGroupItem value="primary" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Primario (con brillo)</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                <RadioGroupItem value="outline" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Secundario (borde)</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </Card>
                ))}
                {fields.length < 2 && (
                    <Button type="button" variant="outline" onClick={() => append({ text: '', url: '', variant: 'primary'})}>
                        Añadir Botón
                    </Button>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="backgroundImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen de Fondo</FormLabel>
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

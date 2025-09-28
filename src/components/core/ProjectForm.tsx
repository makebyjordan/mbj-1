"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import { createProject, updateProject, Project } from "@/services/projects";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  imageHint: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  type: z.enum(['project', 'blog']).default('project'),
  htmlContent: z.string().optional(),
});

type ProjectFormProps = {
    project: Project | null;
    onSave: () => void;
}

export default function ProjectForm({ project, onSave }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      imageHint: "",
      url: "",
      type: "project",
      htmlContent: "",
    },
  });

  useEffect(() => {
    if (project) {
        form.reset({
            title: project.title || "",
            description: project.description || "",
            imageUrl: project.imageUrl || "",
            imageHint: project.imageHint || "",
            url: project.url || "",
            type: project.type || 'project',
            htmlContent: project.htmlContent || "",
        });
        if (project.imageUrl) {
            setImagePreview(project.imageUrl);
        } else {
            setImagePreview(null);
        }
    } else {
        form.reset({
            title: "",
            description: "",
            imageUrl: "",
            imageHint: "",
            url: "",
            type: "project",
            htmlContent: "",
        });
        setImagePreview(null);
    }
  }, [project, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        form.setValue("imageUrl", result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        const dataToSave: Project = {
            title: values.title || "",
            description: values.description || "",
            imageUrl: values.imageUrl || "",
            imageHint: values.imageHint || "",
            url: values.url || "",
            type: values.type || 'project',
            htmlContent: values.htmlContent || "",
        };

        if (project && project.id) {
            await updateProject(project.id, dataToSave);
        } else {
            await createProject(dataToSave);
        }
        onSave();
    } catch (error) {
        console.error("Error saving project:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar el proyecto. Revisa la consola para más detalles.",
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
                    <Input placeholder="Nombre del proyecto o entrada de blog" {...field} className="bg-background/50" />
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
                    placeholder="Describe tu proyecto o escribe el contenido del blog..."
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
                        <FormLabel>Imagen del Proyecto</FormLabel>
                        <FormControl>
                            <div>
                                <Input 
                                    type="file" 
                                    className="hidden" 
                                    ref={fileInputRef} 
                                    onChange={handleImageChange}
                                    accept="image/png, image/jpeg, image/gif"
                                />
                                <div 
                                    className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center cursor-pointer hover:bg-background/50 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {imagePreview ? (
                                        <div className="relative w-full h-40">
                                            <Image src={imagePreview} alt="Vista previa" layout="fill" objectFit="contain" className="rounded-md" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <UploadCloud className="w-8 h-8" />
                                            <span>Haz clic para subir una imagen</span>
                                            <span className="text-xs">PNG, JPG, GIF</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
              control={form.control}
              name="htmlContent"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Importar desde HTML (Opcional)</FormLabel>
                  <FormControl>
                      <Textarea
                        placeholder="Pega tu código HTML aquí..."
                        className="h-40 bg-background/50 font-mono"
                        {...field}
                      />
                  </FormControl>
                   <FormDescription>
                    El contenido HTML se renderizará en la página de detalles.
                  </FormDescription>
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
                <FormLabel>URL Externa (Opcional)</FormLabel>
                <FormControl>
                    <Input placeholder="https://mi-proyecto.com" {...field} className="bg-background/50" />
                </FormControl>
                 <FormDescription>
                    Si se proporciona, el botón principal apuntará aquí. Si no, a la página de detalles.
                  </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Contenido</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="project" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Proyecto (Aparece en "Mis Creaciones")
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="blog" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Entrada de Blog (Aparece en la sección "Blog")
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
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
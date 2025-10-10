
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { saveAprendePage, type AprendePageData } from "@/services/aprende-pages";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const featureCardSchema = z.object({
  icon: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

const iconListItemSchema = z.object({
  icon: z.string().optional(),
  title: z.string().optional(),
});

const mediaGridCardSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
});

const pricingCardSchema = z.object({
  htmlContent: z.string().min(1, "El contenido HTML no puede estar vacío."),
});

const faqItemSchema = z.object({
  question: z.string().min(1, "La pregunta no puede estar vacía."),
  answer: z.string().min(1, "La respuesta no puede estar vacía."),
});

const openQuestionItemSchema = z.object({
  question: z.string().min(1, "La pregunta no puede estar vacía."),
});

const checkboxOptionSchema = z.object({
  label: z.string().min(1, "La opción no puede estar vacía."),
});

const checkboxQuestionItemSchema = z.object({
  question: z.string().min(1, "La pregunta no puede estar vacía."),
  options: z.array(checkboxOptionSchema).min(1, "Debe haber al menos una opción."),
});


const formSchema = z.object({
  title: z.string().min(2, { message: "El título es requerido." }),
  code: z.string().min(2, { message: "El código es requerido." }),
  htmlText: z.string().optional(),
  heroEnabled: z.boolean().default(false),
  heroTitle: z.string().optional(),
  heroDescription: z.string().optional(),
  heroCtaText: z.string().optional(),
  heroCtaUrl: z.string().optional(),
  heroImageUrl: z.string().optional(),
  featureSectionEnabled: z.boolean().default(false),
  featureSectionTitle: z.string().optional(),
  featureSectionDescription: z.string().optional(),
  featureSectionCtaText: z.string().optional(),
  featureSectionCtaUrl: z.string().optional(),
  featureSectionCards: z.array(featureCardSchema).optional(),
  iconListSectionEnabled: z.boolean().default(false),
  iconListSectionDescription: z.string().optional(),
  iconListSectionItems: z.array(iconListItemSchema).optional(),
  mediaGridSectionEnabled: z.boolean().default(false),
  mediaGridSectionCards: z.array(mediaGridCardSchema).optional(),
  pricingSectionEnabled: z.boolean().default(false),
  pricingSectionCards: z.array(pricingCardSchema).optional(),
  fullWidthMediaSectionEnabled: z.boolean().default(false),
  fullWidthMediaSectionTitle: z.string().optional(),
  fullWidthMediaSectionDescription: z.string().optional(),
  fullWidthMediaSectionImageUrl: z.string().optional(),
  fullWidthMediaSectionVideoUrl: z.string().optional(),
  faqSectionEnabled: z.boolean().default(false),
  faqSectionItems: z.array(faqItemSchema).optional(),
  openQuestionnaireEnabled: z.boolean().default(false),
  openQuestionnaireTitle: z.string().optional(),
  openQuestionnaireItems: z.array(openQuestionItemSchema).optional(),
  checkboxQuestionnaireEnabled: z.boolean().default(false),
  checkboxQuestionnaireTitle: z.string().optional(),
  checkboxQuestionnaireItems: z.array(checkboxQuestionItemSchema).optional(),
  contactFormEnabled: z.boolean().default(false),
  contactFormTitle: z.string().optional(),
  contactFormShowName: z.boolean().default(false),
  contactFormShowPhone: z.boolean().default(false),
  contactFormShowEmail: z.boolean().default(false),
  contactFormShowTextMessage: z.boolean().default(false),
  contactFormShowInstagram: z.boolean().default(false),
  contactFormShowFacebook: z.boolean().default(false),
  contactFormShowLinkedIn: z.boolean().default(false),
  contactFormShowTikTok: z.boolean().default(false),
  ctaSectionEnabled: z.boolean().default(false),
  ctaSectionTitle: z.string().optional(),
  ctaSectionDescription: z.string().optional(),
  ctaSectionButtonText: z.string().optional(),
  ctaSectionButtonUrl: z.string().optional(),
});

type AprendePageFormValues = z.infer<typeof formSchema>;

interface AprendePageFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onFormSubmit: () => void;
  pageData: AprendePageData | null;
}

export default function AprendePageForm({ isOpen, setIsOpen, onFormSubmit, pageData }: AprendePageFormProps) {
  const { toast } = useToast();
  const isEditing = !!pageData;

  const form = useForm<AprendePageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      code: "",
      htmlText: "",
      heroEnabled: false,
      heroTitle: "",
      heroDescription: "",
      heroCtaText: "",
      heroCtaUrl: "",
      heroImageUrl: "",
      featureSectionEnabled: false,
      featureSectionTitle: "",
      featureSectionDescription: "",
      featureSectionCtaText: "",
      featureSectionCtaUrl: "",
      featureSectionCards: [],
      iconListSectionEnabled: false,
      iconListSectionDescription: "",
      iconListSectionItems: [],
      mediaGridSectionEnabled: false,
      mediaGridSectionCards: [],
      pricingSectionEnabled: false,
      pricingSectionCards: [],
      fullWidthMediaSectionEnabled: false,
      fullWidthMediaSectionTitle: "",
      fullWidthMediaSectionDescription: "",
      fullWidthMediaSectionImageUrl: "",
      fullWidthMediaSectionVideoUrl: "",
      faqSectionEnabled: false,
      faqSectionItems: [],
      openQuestionnaireEnabled: false,
      openQuestionnaireTitle: "",
      openQuestionnaireItems: [],
      checkboxQuestionnaireEnabled: false,
      checkboxQuestionnaireTitle: "",
      checkboxQuestionnaireItems: [],
      contactFormEnabled: false,
      contactFormTitle: "Contacta con nosotros",
      contactFormShowName: true,
      contactFormShowPhone: true,
      contactFormShowEmail: true,
      contactFormShowTextMessage: true,
      contactFormShowInstagram: false,
      contactFormShowFacebook: false,
      contactFormShowLinkedIn: false,
      contactFormShowTikTok: false,
      ctaSectionEnabled: false,
      ctaSectionTitle: "",
      ctaSectionDescription: "",
      ctaSectionButtonText: "",
      ctaSectionButtonUrl: "",
    },
  });
  
  const heroEnabled = form.watch("heroEnabled");
  const featureSectionEnabled = form.watch("featureSectionEnabled");
  const iconListSectionEnabled = form.watch("iconListSectionEnabled");
  const mediaGridSectionEnabled = form.watch("mediaGridSectionEnabled");
  const pricingSectionEnabled = form.watch("pricingSectionEnabled");
  const fullWidthMediaSectionEnabled = form.watch("fullWidthMediaSectionEnabled");
  const faqSectionEnabled = form.watch("faqSectionEnabled");
  const openQuestionnaireEnabled = form.watch("openQuestionnaireEnabled");
  const checkboxQuestionnaireEnabled = form.watch("checkboxQuestionnaireEnabled");
  const contactFormEnabled = form.watch("contactFormEnabled");
  const ctaSectionEnabled = form.watch("ctaSectionEnabled");

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({ control: form.control, name: "featureSectionCards", });
  const { fields: iconListFields, append: appendIconList, remove: removeIconList } = useFieldArray({ control: form.control, name: "iconListSectionItems", });
  const { fields: mediaGridFields, append: appendMediaGrid, remove: removeMediaGrid } = useFieldArray({ control: form.control, name: "mediaGridSectionCards", });
  const { fields: pricingFields, append: appendPricing, remove: removePricing } = useFieldArray({ control: form.control, name: "pricingSectionCards", });
  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({ control: form.control, name: "faqSectionItems", });
  const { fields: openQuestionFields, append: appendOpenQuestion, remove: removeOpenQuestion } = useFieldArray({ control: form.control, name: "openQuestionnaireItems", });
  const { fields: checkboxQuestionFields, append: appendCheckboxQuestion, remove: removeCheckboxQuestion } = useFieldArray({ control: form.control, name: "checkboxQuestionnaireItems", });

  useEffect(() => {
    if (isEditing && pageData) {
      form.reset(pageData);
    } else {
      form.reset();
    }
  }, [isEditing, pageData, form]);


  const onSubmit = async (values: AprendePageFormValues) => {
    const data = {
      ...values,
      id: isEditing ? pageData!.id : undefined,
    };
    
    const result = await saveAprendePage(data);

    if (result.success) {
      toast({
        title: `Página ${isEditing ? 'Actualizada' : 'Creada'}`,
        description: `La página "${values.title}" ha sido guardada.`,
      });
      onFormSubmit();
      handleOpenChange(false);
    } else {
      toast({
        variant: "destructive",
        title: `Error al ${isEditing ? 'actualizar' : 'crear'}`,
        description: result.error || 'Ocurrió un error desconocido.',
      });
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsOpen(open);
  };

  const contactFormFields = [
    { id: "contactFormShowName", label: "Nombre" },
    { id: "contactFormShowPhone", label: "Teléfono" },
    { id: "contactFormShowEmail", label: "Email" },
    { id: "contactFormShowTextMessage", label: "Mensaje de texto" },
    { id: "contactFormShowInstagram", label: "Instagram" },
    { id: "contactFormShowFacebook", label: "Facebook" },
    { id: "contactFormShowLinkedIn", label: "LinkedIn" },
    { id: "contactFormShowTikTok", label: "TikTok" },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-primary">{isEditing ? 'Editar Página' : 'Nueva Página'}</DialogTitle>
          <DialogDescription>
            Rellena los campos para {isEditing ? 'actualizar' : 'crear'} una página de Aprende.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Landing Page de Servicios" {...field} />
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
                    <FormLabel>Código (URL Slug)</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: landing-servicios" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="htmlText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenido HTML Principal</FormLabel>
                  <FormControl>
                    <Textarea rows={10} placeholder="Escribe el contenido principal aquí. Puedes usar HTML." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator />
            
             <FormField
                control={form.control}
                name="heroEnabled"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Activar Sección Hero</FormLabel>
                        <FormDescription>Añade una cabecera con imagen y CTA.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )}
             />

            {heroEnabled && (
              <div className="space-y-4 p-4 border rounded-md">
                <FormField control={form.control} name="heroTitle" render={({ field }) => ( <FormItem><FormLabel>Título del Hero (H1)</FormLabel><FormControl><Input placeholder="El titular principal" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="heroDescription" render={({ field }) => ( <FormItem><FormLabel>Descripción del Hero</FormLabel><FormControl><Textarea placeholder="Una descripción que enganche" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="heroImageUrl" render={({ field }) => ( <FormItem><FormLabel>URL de la Imagen de Fondo</FormLabel><FormControl><Input placeholder="https://ejemplo.com/imagen.jpg" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="heroCtaText" render={({ field }) => ( <FormItem><FormLabel>Texto del Botón CTA</FormLabel><FormControl><Input placeholder="Ej: Saber más" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="heroCtaUrl" render={({ field }) => ( <FormItem><FormLabel>URL del Botón CTA</FormLabel><FormControl><Input placeholder="https://ejemplo.com/destino" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
              </div>
            )}
            
            <Separator />
            
             <FormField
                control={form.control}
                name="featureSectionEnabled"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Activar Sección de Características</FormLabel>
                        <FormDescription>Añade una sección con título, texto y tarjetas.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )}
             />

            {featureSectionEnabled && (
                <div className="space-y-4 p-4 border rounded-md">
                    <FormField control={form.control} name="featureSectionTitle" render={({ field }) => (<FormItem><FormLabel>Título de la Sección</FormLabel><FormControl><Input placeholder="Título principal de la sección" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="featureSectionDescription" render={({ field }) => (<FormItem><FormLabel>Descripción de la Sección</FormLabel><FormControl><Textarea placeholder="Texto descriptivo de la sección" {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="featureSectionCtaText" render={({ field }) => (<FormItem><FormLabel>Texto del Botón CTA</FormLabel><FormControl><Input placeholder="Ej: Contactar" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="featureSectionCtaUrl" render={({ field }) => (<FormItem><FormLabel>URL del Botón CTA</FormLabel><FormControl><Input placeholder="https://ejemplo.com/contacto" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <Separator className="my-6" />
                    <div>
                        <h3 className="text-lg font-medium mb-2">Tarjetas de Características</h3>
                        {featureFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg relative space-y-4 mb-4">
                            <Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => removeFeature(index)}><Trash2 className="h-4 w-4" /></Button>
                            <FormField control={form.control} name={`featureSectionCards.${index}.icon`} render={({ field }) => ( <FormItem><FormLabel>Icono (SVG)</FormLabel><FormControl><Textarea rows={3} placeholder="Pega el código SVG del icono" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`featureSectionCards.${index}.title`} render={({ field }) => ( <FormItem><FormLabel>Título de la Tarjeta</FormLabel><FormControl><Input placeholder="Título de la característica" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`featureSectionCards.${index}.description`} render={({ field }) => ( <FormItem><FormLabel>Descripción de la Tarjeta</FormLabel><FormControl><Textarea rows={2} placeholder="Descripción de la característica" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        </div>
                        ))}
                        <Button type="button" variant="outline" className="mt-2" onClick={() => appendFeature({ icon: "", title: "", description: "" })}><PlusCircle className="mr-2 h-4 w-4" />Añadir Tarjeta de Característica</Button>
                    </div>
                </div>
            )}
             <Separator />

            <FormField
              control={form.control}
              name="iconListSectionEnabled"
              render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                      <FormLabel>Activar Sección Lista de Iconos</FormLabel>
                      <FormDescription>Muestra una lista de items con icono y título.</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
              )}
            />

            {iconListSectionEnabled && (
               <div className="space-y-4 p-4 border rounded-md">
                 <FormField control={form.control} name="iconListSectionDescription" render={({ field }) => ( <FormItem><FormLabel>Descripción de la Sección</FormLabel><FormControl><Input placeholder="Ideal para todo tipo de..." {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <h3 className="text-lg font-medium pt-4">Items de la lista</h3>
                  {iconListFields.map((field, index) => (
                      <div key={field.id} className="p-4 border rounded-lg relative space-y-4 mb-4">
                           <Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => removeIconList(index)}><Trash2 className="h-4 w-4" /></Button>
                           <FormField control={form.control} name={`iconListSectionItems.${index}.title`} render={({ field }) => (<FormItem><FormLabel>Título</FormLabel><FormControl><Input placeholder="Título del item" {...field} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name={`iconListSectionItems.${index}.icon`} render={({ field }) => (<FormItem><FormLabel>Icono (SVG)</FormLabel><FormControl><Textarea rows={3} placeholder="Pega el código SVG del icono" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                  ))}
                  <Button type="button" variant="outline" className="mt-2" onClick={() => appendIconList({ title: "", icon: "" })}><PlusCircle className="mr-2 h-4 w-4" />Añadir Item</Button>
               </div>
            )}

             <Separator />

             <FormField
                control={form.control}
                name="mediaGridSectionEnabled"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Activar Sección de Tarjetas Multimedia</FormLabel>
                        <FormDescription>Añade una cuadrícula de tarjetas con imagen, video, texto y CTA.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )}
             />

             {mediaGridSectionEnabled && (
                <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-2">Tarjetas Multimedia</h3>
                    {mediaGridFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg relative space-y-4 mb-4">
                            <Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => removeMediaGrid(index)}><Trash2 className="h-4 w-4" /></Button>
                            <FormField control={form.control} name={`mediaGridSectionCards.${index}.title`} render={({ field }) => (<FormItem><FormLabel>Título</FormLabel><FormControl><Input placeholder="Título de la tarjeta" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name={`mediaGridSectionCards.${index}.description`} render={({ field }) => (<FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea placeholder="Descripción de la tarjeta" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name={`mediaGridSectionCards.${index}.imageUrl`} render={({ field }) => ( <FormItem><FormLabel>URL de Imagen</FormLabel><FormControl><Input placeholder="https://ejemplo.com/imagen.jpg" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`mediaGridSectionCards.${index}.videoUrl`} render={({ field }) => (<FormItem><FormLabel>URL de Video (YouTube, Vimeo, etc.)</FormLabel><FormControl><Input placeholder="https://youtube.com/embed/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <FormField control={form.control} name={`mediaGridSectionCards.${index}.ctaText`} render={({ field }) => (<FormItem><FormLabel>Texto del Botón CTA</FormLabel><FormControl><Input placeholder="Ej: Ver Proyecto" {...field} /></FormControl><FormMessage /></FormItem>)} />
                               <FormField control={form.control} name={`mediaGridSectionCards.${index}.ctaUrl`} render={({ field }) => (<FormItem><FormLabel>URL del Botón CTA</FormLabel><FormControl><Input placeholder="https://ejemplo.com/proyecto" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" className="mt-2" onClick={() => appendMediaGrid({ title: "", description: "", imageUrl: "", videoUrl: "", ctaText: "", ctaUrl: "" })}><PlusCircle className="mr-2 h-4 w-4" />Añadir Tarjeta Multimedia</Button>
                </div>
             )}

            <Separator />
            
             <FormField
                control={form.control}
                name="pricingSectionEnabled"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Activar Sección de Precios/HTML</FormLabel>
                        <FormDescription>Añade tarjetas personalizadas usando código HTML.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )}
             />

            {pricingSectionEnabled && (
                <div className="space-y-4 p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-2">Tarjetas HTML</h3>
                     {pricingFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg relative space-y-4 mb-4">
                             <Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => removePricing(index)}><Trash2 className="h-4 w-4" /></Button>
                            <FormField control={form.control} name={`pricingSectionCards.${index}.htmlContent`} render={({ field }) => ( <FormItem><FormLabel>Código HTML de la Tarjeta {index + 1}</FormLabel><FormControl><Textarea rows={10} placeholder="Pega el código HTML de una tarjeta aquí" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        </div>
                    ))}
                     <Button type="button" variant="outline" className="mt-2" onClick={() => appendPricing({ htmlContent: "" })}><PlusCircle className="mr-2 h-4 w-4" />Añadir Tarjeta HTML</Button>
                </div>
            )}
            
            <Separator />
            
             <FormField
                control={form.control}
                name="fullWidthMediaSectionEnabled"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Activar Sección de Contenido Destacado</FormLabel>
                        <FormDescription>Añade una sección a pantalla completa con imagen o video.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )}
             />
             {fullWidthMediaSectionEnabled && (
                <div className="space-y-4 p-4 border rounded-md">
                    <FormField control={form.control} name="fullWidthMediaSectionTitle" render={({ field }) => (<FormItem><FormLabel>Título</FormLabel><FormControl><Input placeholder="Título de la sección" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="fullWidthMediaSectionDescription" render={({ field }) => (<FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea placeholder="Descripción de la sección" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="fullWidthMediaSectionImageUrl" render={({ field }) => ( <FormItem><FormLabel>URL de Imagen</FormLabel><FormControl><Input placeholder="https://ejemplo.com/imagen.jpg" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="fullWidthMediaSectionVideoUrl" render={({ field }) => ( <FormItem><FormLabel>URL de Video (MP4, WebM)</FormLabel><FormControl><Input placeholder="https://ejemplo.com/video.mp4" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
            )}

            <Separator />

            <FormField
              control={form.control}
              name="faqSectionEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Activar Sección de Preguntas Frecuentes</FormLabel>
                    <FormDescription>Añade una sección de preguntas y respuestas en formato acordeón.</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )}
            />

            {faqSectionEnabled && (
              <div className="space-y-4 p-4 border rounded-md">
                <h3 className="text-lg font-medium mb-2">Preguntas y Respuestas</h3>
                {faqFields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg relative space-y-4 mb-4">
                    <Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => removeFaq(index)}><Trash2 className="h-4 w-4" /></Button>
                    <FormField control={form.control} name={`faqSectionItems.${index}.question`} render={({ field }) => ( <FormItem><FormLabel>Pregunta</FormLabel><FormControl><Input placeholder="Escribe la pregunta" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name={`faqSectionItems.${index}.answer`} render={({ field }) => ( <FormItem><FormLabel>Respuesta</FormLabel><FormControl><Textarea placeholder="Escribe la respuesta" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  </div>
                ))}
                <Button type="button" variant="outline" className="mt-2" onClick={() => appendFaq({ question: "", answer: "" })}><PlusCircle className="mr-2 h-4 w-4" />Añadir Pregunta</Button>
              </div>
            )}
            
            <Separator />

            <FormField
                control={form.control}
                name="openQuestionnaireEnabled"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Activar Cuestionario Abierto</FormLabel>
                        <FormDescription>Añade una sección de preguntas con respuestas de texto libre.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )}
            />

            {openQuestionnaireEnabled && (
                <div className="space-y-4 p-4 border rounded-md">
                    <FormField control={form.control} name="openQuestionnaireTitle" render={({ field }) => ( <FormItem><FormLabel>Título del Cuestionario</FormLabel><FormControl><Input placeholder="Título para la sección de preguntas" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <h3 className="text-lg font-medium pt-4">Preguntas</h3>
                    {openQuestionFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg relative space-y-4 mb-4">
                            <Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => removeOpenQuestion(index)}><Trash2 className="h-4 w-4" /></Button>
                            <FormField control={form.control} name={`openQuestionnaireItems.${index}.question`} render={({ field }) => ( <FormItem><FormLabel>Pregunta {index + 1}</FormLabel><FormControl><Input placeholder="Escribe la pregunta" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        </div>
                    ))}
                    <Button type="button" variant="outline" className="mt-2" onClick={() => appendOpenQuestion({ question: "" })}><PlusCircle className="mr-2 h-4 w-4" /> Añadir Pregunta Abierta</Button>
                </div>
            )}
            
            <Separator />
            
            <FormField
                control={form.control}
                name="checkboxQuestionnaireEnabled"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Activar Cuestionario de Selección</FormLabel>
                        <FormDescription>Añade preguntas con opciones de tipo checkbox.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )}
            />
            
            {checkboxQuestionnaireEnabled && (
                <div className="space-y-4 p-4 border rounded-md">
                     <FormField control={form.control} name="checkboxQuestionnaireTitle" render={({ field }) => ( <FormItem><FormLabel>Título del Cuestionario</FormLabel><FormControl><Input placeholder="Título para la sección de checkboxes" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <h3 className="text-lg font-medium pt-4">Preguntas de Selección</h3>
                    {checkboxQuestionFields.map((field, index) => ( <CheckboxQuestionField key={field.id} form={form} questionIndex={index} removeQuestion={removeCheckboxQuestion} /> ))}
                     <Button type="button" variant="outline" className="mt-2" onClick={() => appendCheckboxQuestion({ question: "", options: [{label: ""}] })}> <PlusCircle className="mr-2 h-4 w-4" /> Añadir Pregunta de Selección </Button>
                </div>
            )}
            
            <Separator />

            <FormField
                control={form.control}
                name="contactFormEnabled"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Activar Formulario de Contacto</FormLabel>
                        <FormDescription>Añade un formulario para que los usuarios dejen sus datos.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )}
            />

            {contactFormEnabled && (
                <div className="space-y-4 p-4 border rounded-md">
                    <FormField control={form.control} name="contactFormTitle" render={({ field }) => ( <FormItem><FormLabel>Título del Formulario</FormLabel><FormControl><Input placeholder="Título para el formulario" {...field} /></FormControl><FormMessage /></FormItem> )} />
                     <h3 className="text-lg font-medium pt-4">Campos a mostrar</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {contactFormFields.map((item) => (
                           <FormField
                                key={item.id}
                                control={form.control}
                                name={item.id}
                                render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <div className="space-y-1 leading-none"><FormLabel>{item.label}</FormLabel></div>
                                </FormItem>
                                )}
                            />
                        ))}
                    </div>
                </div>
            )}

            <Separator />

            <FormField
                control={form.control}
                name="ctaSectionEnabled"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Activar Sección CTA Final</FormLabel>
                        <FormDescription>Añade una llamada a la acción final en la página.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )}
            />

            {ctaSectionEnabled && (
              <div className="space-y-4 p-4 border rounded-md">
                <FormField control={form.control} name="ctaSectionTitle" render={({ field }) => ( <FormItem><FormLabel>Título del CTA</FormLabel><FormControl><Input placeholder="¿Listo para empezar?" {...field} /></FormControl><FormMessage /></FormItem> )} />
                 <FormField control={form.control} name="ctaSectionDescription" render={({ field }) => ( <FormItem><FormLabel>Descripción del CTA</FormLabel><FormControl><Textarea placeholder="Ponte en contacto con nosotros..." {...field} /></FormControl><FormMessage /></FormItem> )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="ctaSectionButtonText" render={({ field }) => ( <FormItem><FormLabel>Texto del Botón</FormLabel><FormControl><Input placeholder="Contactar Ahora" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="ctaSectionButtonUrl" render={({ field }) => ( <FormItem><FormLabel>URL del Botón (Opcional)</FormLabel><FormControl><Input placeholder="https://ejemplo.com/contacto" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Página')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function CheckboxQuestionField({ form, questionIndex, removeQuestion }: { form: any, questionIndex: number, removeQuestion: (index: number) => void }) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: `checkboxQuestionnaireItems.${questionIndex}.options`
    });

    return (
        <div className="p-4 border rounded-lg relative space-y-4 mb-4">
            <Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => removeQuestion(questionIndex)}>
                <Trash2 className="h-4 w-4" />
            </Button>
            <FormField control={form.control} name={`checkboxQuestionnaireItems.${questionIndex}.question`} render={({ field }: any) => (
                <FormItem><FormLabel>Pregunta {questionIndex + 1}</FormLabel><FormControl><Input placeholder="Escribe la pregunta" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <div className="pl-4 space-y-2">
                 <FormLabel>Opciones</FormLabel>
                {fields.map((optionField, optionIndex) => (
                     <div key={optionField.id} className="flex items-center gap-2">
                        <FormField control={form.control} name={`checkboxQuestionnaireItems.${questionIndex}.options.${optionIndex}.label`} render={({ field }: any) => (
                            <FormItem className="flex-grow"><FormControl><Input placeholder={`Opción ${optionIndex + 1}`} {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => remove(optionIndex)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="ghost" size="sm" onClick={() => append({ label: "" })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir Opción
                </Button>
            </div>
        </div>
    );
}

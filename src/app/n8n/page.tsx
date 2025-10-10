
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getN8NTemplates, N8NTemplate } from "@/services/n8n-templates";
import { Loader2, Copy, Check, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function N8NPage() {
  const [templates, setTemplates] = useState<N8NTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templatesFromDb = await getN8NTemplates();
        setTemplates(templatesFromDb);
      } catch (error) {
        console.error("Error fetching N8N templates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleCopy = (jsonContent: string, templateId: string) => {
    navigator.clipboard.writeText(jsonContent);
    toast({
      title: "Copiado",
      description: "El código JSON de la plantilla ha sido copiado.",
    });
    setCopiedTemplateId(templateId);
    setTimeout(() => setCopiedTemplateId(null), 2000); // Reset icon after 2 seconds
  };

  return (
    <main className="w-full container mx-auto px-4 py-20 md:py-32 flex-grow">
      <div className="text-center mb-12">
        <h1 className="section-title">Plantillas N8N</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Bienvenido a la colección exclusiva de plantillas para N8N. Haz clic para copiar el código.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : templates.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg py-16">
          Aún no hay plantillas para mostrar. ¡Añade una desde el CORE!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="glass-card flex flex-col">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="font-headline text-2xl">{template.title}</CardTitle>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => handleCopy(template.jsonContent, template.id!)}
                  aria-label="Copiar JSON"
                >
                  {copiedTemplateId === template.id ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Haz clic en el icono para copiar el flujo de trabajo.</p>
              </CardContent>
              {template.htmlContent && (
                <CardFooter>
                    <Button asChild variant="link" className="p-0 text-primary">
                        <Link href={`/n8n/aprende/${template.id}`} target="_blank">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Aprender
                        </Link>
                    </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

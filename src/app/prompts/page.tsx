
"use client";

import { useEffect, useState } from "react";
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { getPrompts, Prompt } from "@/services/prompts";
import { Loader2, Clipboard, Check, ChevronDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const promptsFromDb = await getPrompts();
        setPrompts(promptsFromDb);
      } catch (error) {
        console.error("Error fetching prompts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  const handleCopy = (promptText: string, promptId: string) => {
    navigator.clipboard.writeText(promptText);
    toast({
      title: "Copiado",
      description: "El prompt ha sido copiado al portapapeles.",
    });
    setCopiedPromptId(promptId);
    setTimeout(() => setCopiedPromptId(null), 2000); // Reset after 2 seconds
  };

  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-background min-h-screen">
      <Header />
      <main className="w-full container mx-auto px-4 py-20 md:py-32 flex-grow">
        <div className="text-center mb-12">
            <h1 className="section-title">Prompts</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Una colección de prompts para inspirar la creatividad y la generación de ideas.
            </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : prompts.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg py-16">
            Aún no hay prompts para mostrar. ¡Añade uno desde el CORE!
          </p>
        ) : (
          <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto space-y-4">
            {prompts.map((prompt) => (
              <AccordionItem value={prompt.id!} key={prompt.id} className="border-none">
                <Card className="glass-card overflow-hidden">
                  <AccordionTrigger className="w-full text-left p-0 hover:no-underline [&[data-state=open]>div>div>svg]:rotate-180">
                     <CardHeader className="flex-1 flex flex-row items-center justify-between p-4 md:p-6 w-full">
                        <div>
                            <CardTitle className="font-headline text-2xl">{prompt.title}</CardTitle>
                            <CardDescription className="mt-1">{prompt.description}</CardDescription>
                        </div>
                        <ChevronDown className="h-6 w-6 text-primary transition-transform duration-300" />
                     </CardHeader>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <div className="p-4 bg-background/50 rounded-md relative group">
                        <pre className="whitespace-pre-wrap font-code text-sm text-foreground">
                          <code>{prompt.promptText}</code>
                        </pre>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleCopy(prompt.promptText, prompt.id!)}
                        >
                          {copiedPromptId === prompt.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Clipboard className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </main>
      <Footer />
    </div>
  );
}

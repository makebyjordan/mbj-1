
"use client";

import { useEffect, useState } from "react";
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import { getProtocols, Protocol } from "@/services/protocols";
import { Loader2, BookCopy, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function ProtocolsPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const data = await getProtocols();
        setProtocols(data);
      } catch (error) {
        console.error("Error fetching protocols:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProtocols();
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-background min-h-screen">
      <Header />
      <main className="w-full container mx-auto px-4 py-20 md:py-32 flex-grow">
        <div className="text-center mb-12">
          <h1 className="section-title">Protocolos de Actuación</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Una colección de guías paso a paso para estandarizar procesos y asegurar la calidad.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : protocols.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg py-16">
            Aún no hay protocolos para mostrar. ¡Añade uno desde el CORE!
          </p>
        ) : (
          <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto space-y-4">
            {protocols.map((protocol) => (
              <AccordionItem value={protocol.id!} key={protocol.id} className="border-none">
                <Card className="glass-card overflow-hidden">
                  <AccordionTrigger className="w-full text-left p-0 hover:no-underline [&[data-state=open]>div>svg]:rotate-180">
                     <div className="flex-1 flex flex-row items-center justify-between p-4 md:p-6 w-full">
                        <div className="flex items-center gap-4">
                            <BookCopy className="h-6 w-6 text-primary" />
                            <span className="font-headline text-2xl">{protocol.title}</span>
                        </div>
                        <ChevronDown className="h-6 w-6 text-primary transition-transform duration-300" />
                     </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 md:p-6 pt-0 space-y-8">
                       {protocol.steps?.map((step, index) => (
                         <div key={index} className="space-y-4 prose prose-invert max-w-none">
                            <h4 className="font-bold text-primary not-prose text-lg">Paso {index + 1}: {step.title}</h4>
                            <p>{step.description}</p>
                            {step.imageUrl && (
                                <div className="relative w-full h-auto rounded-lg overflow-hidden mt-2 shadow-lg">
                                    <Image
                                        src={step.imageUrl}
                                        alt={`Ilustración para ${step.title || `Paso ${index + 1}`}`}
                                        width={800}
                                        height={450}
                                        className="object-contain"
                                    />
                                </div>
                            )}
                         </div>
                       ))}
                    </div>
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

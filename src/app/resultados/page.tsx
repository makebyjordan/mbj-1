
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getResultados, Resultado } from "@/services/resultados";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function ResultadosPage() {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResultado, setSelectedResultado] = useState<Resultado | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        const data = await getResultados();
        setResultados(data);
      } catch (error) {
        console.error("Error fetching resultados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResultados();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "El prompt ha sido copiado al portapapeles.",
    });
  };

  const imagesForSelectedResultado = selectedResultado
    ? [selectedResultado.imageUrl, selectedResultado.imageUrl2, selectedResultado.imageUrl3].filter(Boolean) as string[]
    : [];

  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-background min-h-screen">
      <Header />
      <main className="w-full container mx-auto px-4 py-20 md:py-32 flex-grow">
        <div className="text-center mb-12">
          <h1 className="section-title">Resultados de IA</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Una galería de imágenes generadas por inteligencia artificial, junto con los prompts que les dieron vida.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : resultados.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg py-16">
            Aún no hay resultados para mostrar. ¡Crea uno desde el CORE!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resultados.map((resultado) => (
              <Card 
                key={resultado.id} 
                className="glass-card overflow-hidden group cursor-pointer"
                onClick={() => setSelectedResultado(resultado)}
              >
                <CardHeader className="p-0">
                   <Image
                      src={resultado.imageUrl}
                      alt={resultado.title}
                      width={600}
                      height={600}
                      className="w-full h-auto aspect-square object-cover"
                    />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="font-headline text-2xl">{resultado.title}</CardTitle>
                    <p className="mt-2 text-muted-foreground line-clamp-3">
                        <Wand2 className="inline-block mr-2 h-4 w-4 text-primary"/>
                        {resultado.prompt}
                    </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
      
      <Dialog open={!!selectedResultado} onOpenChange={(isOpen) => !isOpen && setSelectedResultado(null)}>
        <DialogContent className="sm:max-w-4xl h-[90vh] glass-card flex flex-col p-4 md:p-6">
            {selectedResultado && (
              <>
                <DialogHeader>
                    <DialogTitle className="font-headline text-3xl text-primary">{selectedResultado.title}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start flex-grow overflow-hidden">
                    <div className="relative w-full h-full min-h-[300px] md:min-h-0">
                       <Carousel className="w-full h-full">
                          <CarouselContent className="h-full">
                            {imagesForSelectedResultado.map((imgUrl, index) => (
                              <CarouselItem key={index} className="h-full flex items-center justify-center">
                                 <a href={imgUrl} target="_blank" rel="noopener noreferrer">
                                    <Image 
                                        src={imgUrl} 
                                        alt={`${selectedResultado.title} - imagen ${index + 1}`} 
                                        width={800}
                                        height={800}
                                        className="object-contain rounded-md max-w-full max-h-full"
                                    />
                                 </a>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                           {imagesForSelectedResultado.length > 1 && (
                            <>
                                <CarouselPrevious className="left-2" />
                                <CarouselNext className="right-2" />
                            </>
                           )}
                        </Carousel>
                    </div>
                    <div className="relative h-full max-h-[calc(80vh-100px)]">
                        <ScrollArea className="h-full">
                            <div className="prose prose-invert max-w-none pr-4">
                                <p className="text-sm font-semibold text-muted-foreground flex items-start gap-2">
                                    <Wand2 className="h-4 w-4 mt-1 text-primary shrink-0"/> 
                                    <span>{selectedResultado.prompt}</span>
                                </p>
                            </div>
                        </ScrollArea>
                         <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => copyToClipboard(selectedResultado.prompt)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                    </div>
                </div>
                <div className="mt-auto pt-4 flex justify-end">
                  <Button variant="outline" onClick={() => setSelectedResultado(null)}>Cerrar</Button>
                </div>
              </>
            )}
        </DialogContent>
      </Dialog>

    </div>
  );
}

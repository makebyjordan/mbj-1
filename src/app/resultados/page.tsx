
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getResultados, Resultado } from "@/services/resultados";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ResultadosPage() {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResultado, setSelectedResultado] = useState<Resultado | null>(null);

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
        <DialogContent className="sm:max-w-4xl max-h-[90vh] glass-card flex flex-col">
            {selectedResultado && (
              <>
                <DialogHeader>
                    <DialogTitle className="font-headline text-3xl text-primary">{selectedResultado.title}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start overflow-hidden">
                    <div className="relative aspect-square">
                        <Image 
                            src={selectedResultado.imageUrl} 
                            alt={selectedResultado.title} 
                            fill
                            className="object-contain rounded-md"
                        />
                    </div>
                    <ScrollArea className="h-full max-h-[65vh] pr-4">
                        <div className="prose prose-invert max-w-none">
                            <p className="text-sm font-semibold text-muted-foreground flex items-start gap-2">
                                <Wand2 className="h-4 w-4 mt-1 text-primary shrink-0"/> 
                                <span>{selectedResultado.prompt}</span>
                            </p>
                        </div>
                    </ScrollArea>
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

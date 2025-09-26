
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLinkCards, LinkCard } from "@/services/link-cards";
import { Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Links({ id }: { id: string }) {
  const [latestCards, setLatestCards] = useState<LinkCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLinkCards = async () => {
      try {
        const cardsFromDb = await getLinkCards();
        setLatestCards(cardsFromDb.slice(0, 3)); // Get the latest 3 cards
      } catch (error) {
        console.error("Error fetching link cards:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLinkCards();
  }, []);

  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <div className="text-center mb-12">
        <h2 className="section-title">Enlaces de Interés</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Una colección curada de herramientas, artículos y recursos que encuentro útiles.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : latestCards.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg py-16">
          Aún no hay categorías de enlaces para mostrar. ¡Añade una desde el CORE!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestCards.map((card) => (
              <Card key={card.id} className="glass-card overflow-hidden group">
                <CardHeader className="p-0 relative h-48">
                   <Image
                    src={card.imageUrl}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
                    <CardTitle className="font-headline text-3xl text-center text-foreground">{card.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-center">
                    <Button asChild variant="link">
                        <Link href="/links" className="text-primary">
                            Ver enlaces &rarr;
                        </Link>
                    </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
      
      {latestCards.length > 0 && (
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="border-primary/50 bg-transparent hover:bg-primary/10 hover:text-foreground">
            <Link href="/links">
              Ver todas las categorías <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}

    
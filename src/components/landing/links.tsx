
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLinks, LinkItem } from "@/services/links";
import { Loader2, ArrowRight, Link2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Links({ id }: { id: string }) {
  const [latestLinks, setLatestLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const linksFromDb = await getLinks();
        setLatestLinks(linksFromDb.slice(0, 3)); // Get the latest 3
      } catch (error) {
        console.error("Error fetching links:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLinks();
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
      ) : latestLinks.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg py-16">
          Aún no hay enlaces para mostrar. ¡Añade uno desde el CORE!
        </p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {latestLinks.map((item) => (
            <Card key={item.id} className="glass-card hover:border-primary/80 transition-all">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="block p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-full mt-1">
                            <Link2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary">{item.tag}</Badge>
                                <span className="text-muted-foreground/80 truncate text-sm">{item.url}</span>
                            </CardDescription>
                        </div>
                    </div>
                </a>
            </Card>
          ))}
        </div>
      )}
      
      {latestLinks.length > 0 && (
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="border-primary/50 bg-transparent hover:bg-primary/10 hover:text-foreground">
            <Link href="/links">
              Ver todos los enlaces <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}

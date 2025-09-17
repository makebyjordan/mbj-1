
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getShorts, Short } from "@/services/shorts";
import { Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const getYouTubeID = (url: string) => {
    let id = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        id = match[2];
    } else {
        const urlParts = url.split('/');
        id = urlParts[urlParts.length - 1];
        if (id.includes('?')) {
            id = id.split('?')[0];
        }
    }
    return id;
}

export default function LatestShorts({ id }: { id: string }) {
  const [latestShorts, setLatestShorts] = useState<Short[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const shortsFromDb = await getShorts();
        setLatestShorts(shortsFromDb.slice(0, 4)); // Get the latest 4
      } catch (error) {
        console.error("Error fetching shorts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShorts();
  }, []);

  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <div className="text-center mb-12">
        <h2 className="section-title">Últimos Shorts</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Un vistazo rápido a mis últimos videos cortos. ¡Más en la sección de Shorts!
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : latestShorts.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg py-16">
          Aún no hay shorts para mostrar. ¡Añade uno desde el CORE!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {latestShorts.map((short) => (
            <Card key={short.id} className="glass-card overflow-hidden group">
              <CardHeader className="p-0 relative aspect-[9/16]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${getYouTubeID(short.youtubeUrl)}`}
                  title={short.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="font-headline text-lg truncate group-hover:text-primary transition-colors">
                  {short.title}
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {short.tags?.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {latestShorts.length > 0 && (
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="border-primary/50 bg-transparent hover:bg-primary/10 hover:text-foreground">
            <Link href="/shorts">
              Ver todos los Shorts <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}

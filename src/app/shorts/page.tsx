
"use client";

import { useEffect, useState } from "react";
import { getShorts, Short } from "@/services/shorts";
import { Loader2, Youtube } from "lucide-react";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Helper function to extract YouTube video ID from various URL formats
const getYouTubeID = (url: string) => {
    let id = '';
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/|\/shorts\/)/);
    if (url[2] !== undefined) {
        id = url[2].split(/[^0-9a-z_\-]/i);
        id = id[0];
    }
    else {
        id = url;
    }
    return id;
}

export default function ShortsPage() {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const shortsFromDb = await getShorts();
        setShorts(shortsFromDb);
      } catch (error) {
        console.error("Error fetching shorts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShorts();
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-background">
      <Header />
      <main className="w-full container mx-auto px-4 py-20 md:py-32">
        <div className="text-center mb-12">
            <h1 className="section-title">Shorts</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Una colección de videos cortos sobre desarrollo, diseño y creatividad.
            </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : shorts.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg py-16">
            Aún no hay shorts para mostrar. ¡Añade uno desde el CORE!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shorts.map((short) => (
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
                    </CardContent>
                </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

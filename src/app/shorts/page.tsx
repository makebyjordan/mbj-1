
"use client";

import { useEffect, useState, useMemo } from "react";
import { getShorts, Short } from "@/services/shorts";
import { Loader2 } from "lucide-react";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Helper function to extract YouTube video ID from various URL formats
const getYouTubeID = (url: string) => {
    let id = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        id = match[2];
    } else {
        // Handle cases where the ID is at the end of the URL
        const urlParts = url.split('/');
        id = urlParts[urlParts.length - 1];
        if (id.includes('?')) {
            id = id.split('?')[0];
        }
    }
    return id;
}

export default function ShortsPage() {
  const [allShorts, setAllShorts] = useState<Short[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const shortsFromDb = await getShorts();
        setAllShorts(shortsFromDb);
      } catch (error) {
        console.error("Error fetching shorts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShorts();
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allShorts.forEach(short => {
      short.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [allShorts]);

  const filteredShorts = useMemo(() => {
    if (!selectedTag) {
      return allShorts;
    }
    return allShorts.filter(short => short.tags?.includes(selectedTag));
  }, [allShorts, selectedTag]);

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
        
        <div className="flex flex-wrap justify-center gap-2 mb-12">
            <Button
                variant={!selectedTag ? "default" : "outline"}
                onClick={() => setSelectedTag(null)}
                className={!selectedTag ? 'primary-button-glow' : ''}
            >
                Todos
            </Button>
            {allTags.map(tag => (
                <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    onClick={() => setSelectedTag(tag)}
                    className={selectedTag === tag ? 'primary-button-glow' : ''}
                >
                    {tag}
                </Button>
            ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : filteredShorts.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg py-16">
            {selectedTag ? `No hay shorts con la etiqueta "${selectedTag}".` : "Aún no hay shorts para mostrar. ¡Añade uno desde el CORE!"}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredShorts.map((short) => (
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
                            {short.tags?.map(tag => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
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

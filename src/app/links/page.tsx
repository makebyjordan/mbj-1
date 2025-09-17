
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from 'next/link';
import { getLinks, LinkItem } from "@/services/links";
import { Loader2, Link2 } from "lucide-react";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function LinksPage() {
  const [allLinks, setAllLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const linksFromDb = await getLinks();
        setAllLinks(linksFromDb);
      } catch (error) {
        console.error("Error fetching links:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allLinks.forEach(link => {
      tags.add(link.tag);
    });
    return Array.from(tags).sort();
  }, [allLinks]);

  const filteredLinks = useMemo(() => {
    if (!selectedTag) {
      return allLinks;
    }
    return allLinks.filter(link => link.tag === selectedTag);
  }, [allLinks, selectedTag]);

  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-background min-h-screen">
      <Header />
      <main className="w-full container mx-auto px-4 py-20 md:py-32 flex-grow">
        <div className="text-center mb-12">
            <h1 className="section-title">Enlaces de Interés</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Una colección curada de herramientas, artículos y recursos que encuentro útiles.
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
        ) : filteredLinks.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg py-16">
            {selectedTag ? `No hay enlaces con la etiqueta "${selectedTag}".` : "Aún no hay enlaces para mostrar. ¡Añade uno desde el CORE!"}
          </p>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
             {filteredLinks.map((item) => (
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
      </main>
      <Footer />
    </div>
  );
}

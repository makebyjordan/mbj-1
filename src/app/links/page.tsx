
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from 'next/link';
import { getLinks, LinkItem } from "@/services/links";
import { getLinkCards, LinkCard } from "@/services/link-cards";
import { Loader2, Link2, ChevronDown } from "lucide-react";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function LinksPage() {
  const [allLinks, setAllLinks] = useState<LinkItem[]>([]);
  const [allCards, setAllCards] = useState<LinkCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [linksFromDb, cardsFromDb] = await Promise.all([
          getLinks(),
          getLinkCards()
        ]);
        setAllLinks(linksFromDb);
        setAllCards(cardsFromDb);
      } catch (error) {
        console.error("Error fetching links data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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

  const linksByCard = useMemo(() => {
    const grouped: { [key: string]: LinkItem[] } = {};
    filteredLinks.forEach(link => {
      if (!grouped[link.cardId]) {
        grouped[link.cardId] = [];
      }
      grouped[link.cardId].push(link);
    });
    return grouped;
  }, [filteredLinks]);


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
        ) : allCards.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg py-16">
            Aún no hay categorías de enlaces para mostrar. ¡Añade una desde el CORE!
          </p>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-8">
            {allCards.map(card => {
              const linksForCard = linksByCard[card.id!];
              if (!linksForCard || linksForCard.length === 0) return null;

              return (
                <AccordionItem value={card.id!} key={card.id} className="border-none">
                    <Card className="glass-card overflow-hidden">
                        <AccordionTrigger className="w-full p-0 hover:no-underline [&[data-state=open]>div>div>svg]:rotate-180">
                            <CardHeader className="p-0 relative h-48 w-full">
                                <Image
                                    src={card.imageUrl}
                                    alt={card.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-between p-4 w-full">
                                    <CardTitle className="section-title text-3xl text-center flex-1">{card.title}</CardTitle>
                                    <ChevronDown className="h-8 w-8 text-white transition-transform duration-300" />
                                </div>
                            </CardHeader>
                        </AccordionTrigger>
                        <AccordionContent>
                           <CardContent className="p-4 md:p-6 space-y-4">
                                {linksForCard.map(item => (
                                    <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-primary/10 rounded-full mt-1">
                                                <Link2 className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-headline text-xl text-foreground">{item.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="secondary">{item.tag}</Badge>
                                                    <span className="text-muted-foreground/80 truncate text-sm hidden md:inline">{item.url}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>
              )
            })}
          </Accordion>
        )}
      </main>
      <Footer />
    </div>
  );
}

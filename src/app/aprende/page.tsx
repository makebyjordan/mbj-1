"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAprendePages, AprendePageData } from "@/services/aprende-pages";
import { Loader2, Eye, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";

export default function AprendeIndexPage() {
  const [pages, setPages] = useState<AprendePageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const pagesFromDb = await getAprendePages();
        setPages(pagesFromDb);
      } catch (error) {
        console.error("Error fetching Aprende pages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPages();
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-background min-h-screen">
      <Header />
      <main className="w-full container mx-auto px-4 py-20 md:py-32 flex-grow">
        <div className="text-center mb-12">
          <h1 className="section-title">Aprende</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Explora las páginas de contenido creadas para profundizar en diferentes temas.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : pages.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg py-16">
            Aún no hay páginas para mostrar. ¡Crea una desde el CORE!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Card key={page.id} className="glass-card flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{page.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-2">Código: {page.code}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="link" className="p-0 text-primary">
                    <Link href={`/aprende/view/${page.id}`} target="_blank">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Página
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

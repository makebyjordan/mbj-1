
"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { getSajorItems, SajorItem } from "@/services/sajor";
import { Loader2, Link as LinkIcon, FileText, StickyNote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SajorPage() {
  const [items, setItems] = useState<SajorItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
        const isAuth = localStorage.getItem('sajor-auth') === 'true';
        if (!isAuth) {
            router.replace('/sajor/login');
            return;
        }
    } catch (error) {
        console.error("Acceso a localStorage bloqueado, redirigiendo al login", error);
        router.replace('/sajor/login');
        return;
    }

    const fetchItems = async () => {
      try {
        const itemsFromDb = await getSajorItems();
        setItems(itemsFromDb);
      } catch (error) {
        console.error("Error fetching Sajor items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [router]);
  
  if (isLoading) {
    return (
      <main className="w-full container mx-auto px-4 py-20 md:py-32 flex-grow">
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </main>
    );
  }

  return (
    <main className="w-full container mx-auto px-4 py-20 md:py-32 flex-grow">
      <div className="text-center mb-12">
        <h1 className="section-title">SaJor</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Colección de recursos y notas personales.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg py-16">
          Aún no hay elementos en SaJor. ¡Añade uno desde el CORE!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="glass-card flex flex-col">
              <CardHeader>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                      <LinkIcon className="h-5 w-5"/>
                      {item.title || 'Enlace'}
                    </CardTitle>
                  </a>
                ) : (
                  <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    {item.description ? <FileText className="h-5 w-5"/> : <StickyNote className="h-5 w-5"/>}
                    {item.title || 'Nota'}
                  </CardTitle>
                )}
                 {item.description && <CardDescription>{item.description}</CardDescription>}
              </CardHeader>
              <CardContent className="flex-grow prose prose-invert max-w-none prose-p:text-muted-foreground prose-p:mt-2">
                <p>{item.notes}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}


"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { getTeamItems, TeamItem } from "@/services/team";
import { Loader2, Mail, Linkedin, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TeamPage() {
  const [items, setItems] = useState<TeamItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
        const isAuth = localStorage.getItem('team-auth') === 'true';
        if (!isAuth) {
            router.replace('/team/login');
            return;
        }
    } catch (error) {
        console.error("Acceso a localStorage bloqueado, redirigiendo al login", error);
        router.replace('/team/login');
        return;
    }

    const fetchItems = async () => {
      try {
        const itemsFromDb = await getTeamItems();
        setItems(itemsFromDb);
      } catch (error) {
        console.error("Error fetching Team items:", error);
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
        <h1 className="section-title">Nuestro Equipo</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Conoce a los profesionales que hacen posible la magia.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg py-16">
          Aún no hay miembros del equipo para mostrar. ¡Añade uno desde el CORE!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <Card key={item.id} className="glass-card text-center">
              <CardHeader className="items-center">
                {item.imageUrl && (
                    <Image 
                        src={item.imageUrl} 
                        alt={item.name} 
                        width={120} 
                        height={120}
                        className="rounded-full border-4 border-primary/50"
                    />
                )}
                <CardTitle className="font-headline text-3xl pt-4">{item.name}</CardTitle>
                <CardDescription className="text-primary">{item.position}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{item.bio}</p>
                <div className="flex justify-center gap-4 mt-6">
                    {item.email && <a href={`mailto:${item.email}`}><Mail className="h-5 w-5 text-muted-foreground hover:text-primary"/></a>}
                    {item.linkedinUrl && <a href={item.linkedinUrl} target="_blank" rel="noopener noreferrer"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary"/></a>}
                    {item.portfolioUrl && <a href={item.portfolioUrl} target="_blank" rel="noopener noreferrer"><Briefcase className="h-5 w-5 text-muted-foreground hover:text-primary"/></a>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

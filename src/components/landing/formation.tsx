"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Award, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getFormations, Formation } from "@/services/formation";

export default function Formation({ id }: { id: string }) {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const formationItems = await getFormations();
        setFormations(formationItems);
      } catch (error) {
        console.error("Error fetching formations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormations();
  }, []);

  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <div className="text-center">
        <h2 className="section-title">Formación y Certificaciones</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Mi compromiso con el aprendizaje continuo y la excelencia profesional.
        </p>
      </div>
      <div className="mt-12 max-w-4xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : formations.length === 0 ? (
          <p className="text-center text-muted-foreground">Aún no hay formaciones añadidas. ¡Crea una desde el CORE!</p>
        ) : (
          <div className="space-y-8">
            {formations.map((item) => (
              <Card key={item.id} className="glass-card">
                 <CardHeader className="flex flex-row items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full mt-1">
                        <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="font-headline text-2xl">{item.title}</CardTitle>
                        <CardDescription className="text-muted-foreground">{item.description}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {item.url && (
                        <Link href={item.url} target="_blank" className="inline-flex items-center text-primary hover:text-secondary transition-colors text-sm">
                            Ver Credencial <ArrowUpRight className="ml-1 w-4 h-4"/>
                        </Link>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

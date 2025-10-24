
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getGitProtocols, GitProtocol } from "@/services/git";
import { Loader2, Github, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";

export default function GitProtocolsPage() {
  const [protocols, setProtocols] = useState<GitProtocol[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const protocolsFromDb = await getGitProtocols();
        setProtocols(protocolsFromDb);
      } catch (error) {
        console.error("Error fetching Git protocols:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProtocols();
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-background min-h-screen">
      <Header />
      <main className="w-full container mx-auto px-4 py-20 md:py-32 flex-grow">
        <div className="text-center mb-12">
          <h1 className="section-title">Guías de Git</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Una colección de guías y protocolos para estandarizar el uso de Git.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : protocols.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg py-16">
            Aún no hay guías para mostrar. ¡Añade una desde el CORE!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {protocols.map((protocol) => (
              <Card key={protocol.id} className="glass-card flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Github className="h-6 w-6 text-primary" />
                    {protocol.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">{protocol.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="link" className="p-0 text-primary">
                    <Link href={`/git/${protocol.id}`}>
                      Ver Guía <ArrowRight className="ml-2 h-4 w-4" />
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

    
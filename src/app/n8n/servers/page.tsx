"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getN8NServers, N8NServer } from "@/services/n8n-servers";
import { Loader2, Server, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function N8NServersPage() {
  const [servers, setServers] = useState<N8NServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const serversFromDb = await getN8NServers();
        setServers(serversFromDb);
      } catch (error) {
        console.error("Error fetching N8N servers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServers();
  }, []);

  return (
    <main className="w-full container mx-auto px-4 py-20 md:py-32 flex-grow">
      <div className="text-center mb-12">
        <h1 className="section-title">Servidores N8N</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Accede a los diferentes entornos de N8N. Se requerirá un código de acceso.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : servers.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg py-16">
          Aún no hay servidores para mostrar. ¡Añade uno desde el CORE!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server) => (
            <Card key={server.id} className="glass-card flex flex-col">
              <CardHeader className="flex-row items-start gap-4">
                 <div className="p-3 bg-primary/10 rounded-full mt-1">
                    <Server className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-headline text-2xl">{server.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2">Haz clic para acceder al servidor. Se te pedirá un código.</p>
              </CardContent>
              <CardFooter>
                  <Button asChild variant="link" className="p-0 text-primary">
                      <Link href={`/n8n/server/${server.id}`}>
                          <KeyRound className="mr-2 h-4 w-4" />
                          Acceder al Servidor
                      </Link>
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

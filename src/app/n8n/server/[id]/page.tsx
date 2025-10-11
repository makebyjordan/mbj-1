"use client";

import { useEffect, useState } from "react";
import { useParams, notFound, redirect } from "next/navigation";
import { getN8NServerById, N8NServer } from "@/services/n8n-servers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function N8NServerLoginPage() {
  const [server, setServer] = useState<N8NServer | null | undefined>(undefined);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const params = useParams();
  const serverId = params.id as string;
  const { toast } = useToast();

  useEffect(() => {
    if (!serverId) return;
    const fetchServer = async () => {
      setIsLoading(true);
      try {
        const serverData = await getN8NServerById(serverId);
        setServer(serverData);
      } catch (error) {
        console.error("Error fetching server data:", error);
        setServer(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServer();
  }, [serverId]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!server) return;
    
    setIsVerifying(true);
    setTimeout(() => {
      if (code === server.code) {
        toast({
          title: 'Acceso Concedido',
          description: `Redirigiendo a ${server.title}...`,
        });
        window.location.href = server.url; // Use window.location for external redirect
      } else {
        toast({
          variant: 'destructive',
          title: 'Acceso Denegado',
          description: 'El código introducido es incorrecto.',
        });
        setIsVerifying(false);
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (server === null) {
    notFound();
  }
  
  return (
    <div className="flex min-h-[calc(100vh-128px)] flex-col items-center justify-center bg-background p-4">
      <div className="z-10 w-full max-w-md">
        <Card className="glass-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <KeyRound className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-4xl">{server?.title}</CardTitle>
            <CardDescription>Introduce el código de acceso para continuar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Código de acceso..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="bg-background/50 text-center text-lg h-12 tracking-widest"
                  disabled={isVerifying}
                />
              </div>
              <Button type="submit" className="w-full primary-button-glow" disabled={isVerifying}>
                {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isVerifying ? 'Verificando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="mt-6 text-center">
          <Button asChild variant="link">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

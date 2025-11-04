
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Loader2, Users } from 'lucide-react';
import Link from 'next/link';

export default function TeamLoginPage() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (code === '1111') {
        toast({
          title: 'Acceso Concedido',
          description: 'Bienvenido al portal del equipo.',
        });
        try {
          localStorage.setItem('team-auth', 'true');
          router.push('/team');
        } catch (error) {
           console.error("No se pudo guardar en localStorage", error);
           toast({
              variant: 'destructive',
              title: 'Error del Navegador',
              description: 'No se pudo guardar la sesión. Habilita las cookies y el almacenamiento local.',
            });
           setIsLoading(false);
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Acceso Denegado',
          description: 'El código introducido es incorrecto.',
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
     <main className="flex min-h-[calc(100vh-128px)] flex-col items-center justify-center bg-background p-4">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1a1631] via-[#2a234f] to-[#1a1631]"></div>
        <div className="z-10 w-full max-w-md">
            <Card className="glass-card">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Users className="w-12 h-12 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-4xl">Portal del Equipo</CardTitle>
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
                            disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full primary-button-glow" disabled={isLoading}>
                            {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            {isLoading ? 'Verificando...' : 'Entrar'}
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
    </main>
  );
}

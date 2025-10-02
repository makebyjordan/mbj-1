
"use client";

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CoreLoginPage() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular una pequeña demora para la verificación
    setTimeout(() => {
      if (code === 'jordan10') {
        toast({
          title: 'Acceso Concedido',
          description: 'Bienvenido al CORE.',
        });
        // Usar redirect en lugar de router.push
        redirect('/core/dashboard');
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1a1631] via-[#2a234f] to-[#1a1631]"></div>
        <div className="z-10 w-full max-w-md">
            <Card className="glass-card">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <KeyRound className="w-12 h-12 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-4xl">Acceso al CORE</CardTitle>
                    <CardDescription>Introduce el código de acceso para continuar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Input
                            type="password"
                            placeholder="Tu código secreto..."
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
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function CoreDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1a1631] via-[#2a234f] to-[#1a1631]"></div>
      
      <header className="z-10 w-full max-w-6xl flex justify-between items-center py-4 px-4">
        <h1 className="font-headline text-3xl text-primary">CORE Dashboard</h1>
        <Button asChild variant="ghost">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
            <LogOut className="h-4 w-4" />
            <span>Salir</span>
          </Link>
        </Button>
      </header>

      <main className="z-10 flex-1 w-full max-w-6xl py-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-headline text-4xl">¡Bienvenido, Jordan!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">
              Este es tu espacio privado. Aquí puedes gestionar tus proyectos, ideas y contenido exclusivo.
            </p>
            <div className="mt-8 p-6 border-2 border-dashed border-primary/30 rounded-lg text-center">
              <p className="text-muted-foreground">El contenido del panel de control aparecerá aquí.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

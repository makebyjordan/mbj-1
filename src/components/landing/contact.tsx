
"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Contact({ id }: { id: string }) {
  // Reemplaza este número con tu número de WhatsApp, incluyendo el código de país sin el '+'
  const whatsappNumber = "34123456789"; 
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <div className="text-center">
        <h2 className="section-title">Ponte en Contacto</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          ¿Tienes un proyecto en mente o simplemente quieres saludar? Escríbeme.
        </p>

        <div className="mt-12">
            <Button asChild size="lg" className="primary-button-glow text-lg px-8 py-6 rounded-full transition-all duration-300">
                <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Contacta por WhatsApp
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}

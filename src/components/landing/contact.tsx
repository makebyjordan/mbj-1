
"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Contact({ id }: { id: string }) {
  // Enlace al chat de WhatsApp
  const whatsappUrl = "https://chat.whatsapp.com/FcZ5yzcoNw33lY02qDZ0EA";

  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <div className="text-center">
        <h2 className="section-title">Ponte en Contacto</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          ¿Tienes un proyecto en mente o simplemente quieres saludar? Escríbeme.
        </p>

        <div className="mt-12">
            <Button asChild size="lg" className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-6 rounded-full transition-all duration-300 shadow-[0_0_25px_5px_rgba(34,197,94,0.4)] hover:shadow-[0_0_35px_8px_rgba(34,197,94,0.5)] hover:-translate-y-1">
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

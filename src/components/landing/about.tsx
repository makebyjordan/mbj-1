import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function About({ id }: { id: string }) {
  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <Card className="glass-card">
        <CardContent className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="section-title">Sobre Mí</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              ¡Hola! Soy Jordan, un apasionado creador y arquitecto digital. Mi misión es construir cosas que no solo sean hermosas y funcionales, sino que también cuenten una historia convincente.
            </p>
            <p className="mt-4 text-muted-foreground">
              Con experiencia en desarrollo web, branding y estrategia de contenido, abordo cada proyecto con una perspectiva holística. Ya sea un nuevo sitio web, una identidad de marca o una idea de negocio, me encanta el proceso de convertir una chispa de inspiración en una realidad tangible. Creemos algo increíble juntos.
            </p>
          </div>
          <div className="order-1 md:order-2 h-full w-full">
            <Image
              src="https://picsum.photos/seed/about-me/600/600"
              alt="Un retrato de Jordan"
              width={600}
              height={600}
              data-ai-hint="creator portrait"
              className="rounded-lg object-cover aspect-square"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

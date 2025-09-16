
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getHeroContent, HeroContentData } from "@/services/hero";
import { Loader2 } from "lucide-react";

export default function Hero() {
  const [heroContent, setHeroContent] = useState<HeroContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const content = await getHeroContent();
        setHeroContent(content);
      } catch (error) {
        console.error("Error fetching hero content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHeroContent();
  }, []);

  if (isLoading) {
    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center text-center py-20 md:py-32 overflow-hidden">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </section>
    );
  }

  if (!heroContent) {
    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center text-center py-20 md:py-32 overflow-hidden">
            <p>No se pudo cargar el contenido. Por favor, configúralo en el dashboard.</p>
        </section>
    );
  }

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      {heroContent.backgroundImageUrl && (
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
              src={heroContent.backgroundImageUrl}
              alt="Hero background"
              fill
              className="object-cover"
              quality={100}
              priority
          />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}
      
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#A19CD8"
        />
      </div>

      <div className="z-20 container px-4">
        {heroContent.title && (
          <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl tracking-wider text-foreground" style={{textShadow: '0 0 20px hsl(var(--primary) / 0.5)'}}>
            {heroContent.title}
          </h1>
        )}
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-light">
          {heroContent.description}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          {heroContent.buttons.map((button, index) => (
             <Button key={index} asChild size="lg" className={`${button.variant === 'primary' ? 'primary-button-glow' : 'bg-transparent border-primary/50 hover:bg-primary/10 hover:text-foreground'} text-lg px-8 py-6 rounded-full transition-all duration-300`}>
                <Link href={button.url}>{button.text}</Link>
             </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

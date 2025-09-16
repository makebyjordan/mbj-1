import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";

export default function Hero() {
  return (
    <section className="relative w-full h-[90vh] flex flex-col items-center justify-center text-center py-20 md:py-32">
      <div className="absolute top-0 left-0 w-full h-full">
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
      <div className="z-10 container px-4">
        <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl tracking-wider text-foreground" style={{textShadow: '0 0 20px hsl(var(--primary) / 0.5)'}}>
          MAKEBYJORDAN
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-light">
          A creative mind forging digital experiences. I build stunning websites, powerful brands, and engaging content that tells a story.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg" className="primary-button-glow text-lg px-8 py-6 rounded-full">
            <Link href="#portfolio">View My Work</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-transparent border-primary/50 text-lg px-8 py-6 rounded-full hover:bg-primary/10 hover:text-foreground transition-all duration-300">
            <Link href="#contact">Get In Touch</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

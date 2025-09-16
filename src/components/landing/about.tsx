import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function About({ id }: { id: string }) {
  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <Card className="glass-card">
        <CardContent className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="section-title">About Me</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Hello! I'm Jordan, a passionate creator and digital architect. My mission is to build things that are not only beautiful and functional but also tell a compelling story.
            </p>
            <p className="mt-4 text-muted-foreground">
              With a background in web development, branding, and content strategy, I approach every project with a holistic perspective. Whether it's a new website, a brand identity, or a business idea, I love the process of turning a spark of inspiration into a tangible reality. Let's create something amazing together.
            </p>
          </div>
          <div className="order-1 md:order-2 h-full w-full">
            <Image
              src="https://picsum.photos/seed/about-me/600/600"
              alt="A portrait of Jordan"
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


"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAboutContent, AboutContentData } from "@/services/about";
import { Loader2 } from "lucide-react";

export default function About({ id }: { id: string }) {
  const [content, setContent] = useState<AboutContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const aboutContent = await getAboutContent();
        setContent(aboutContent);
      } catch (error) {
        console.error("Error fetching about content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (isLoading) {
    return (
      <section id={id} className="py-20 md:py-32 w-full">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (!content) {
    return null; // Or a fallback component
  }

  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <Card className="glass-card">
        <CardContent className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="section-title">{content.title}</h2>
            {content.description.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mt-4 text-muted-foreground text-lg first:mt-4">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="order-1 md:order-2 h-full w-full">
            <Image
              src={content.imageUrl}
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

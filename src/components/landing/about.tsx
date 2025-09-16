
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

  const paragraphs = content.description.split('\n\n');
  const middleIndex = Math.ceil(paragraphs.length / 2);
  const firstHalf = paragraphs.slice(0, middleIndex);
  const secondHalf = paragraphs.slice(middleIndex);

  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <Card className="glass-card">
        <CardContent className="p-8 md:p-12 flex flex-col items-center text-center">
          <div className="w-full max-w-4xl">
            <h2 className="section-title">{content.title}</h2>
            {firstHalf.map((paragraph, index) => (
              <p key={index} className="mt-4 text-muted-foreground text-lg text-left">
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="my-8 md:my-12 w-full max-w-2xl">
            <Image
              src={content.imageUrl}
              alt="Un retrato de Jordan"
              width={600}
              height={600}
              data-ai-hint="creator portrait"
              className="rounded-lg object-cover aspect-square w-full"
            />
          </div>

          <div className="w-full max-w-4xl">
             {secondHalf.map((paragraph, index) => (
              <p key={index} className="mt-4 text-muted-foreground text-lg text-left">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

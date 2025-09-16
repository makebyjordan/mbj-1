import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const blogPosts = PlaceHolderImages.filter(img => img.id.startsWith("blog-"));

export default function Blog({ id }: { id: string }) {
  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <div className="text-center">
        <h2 className="section-title">Desde el Blog</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Mis últimas reflexiones sobre diseño, tecnología y cómo construir grandes cosas.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.id} className="glass-card overflow-hidden group">
            <CardHeader className="p-0">
              <Image
                src={post.imageUrl}
                alt={post.description}
                width={600}
                height={400}
                data-ai-hint={post.imageHint}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="font-headline text-2xl">
                {(post as any).title}
              </CardTitle>
              <p className="mt-2 text-muted-foreground">{post.description}</p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
                <Link href="#" className="flex items-center text-primary hover:text-secondary transition-colors">
                    Leer Más <ArrowUpRight className="ml-1 w-4 h-4"/>
                </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

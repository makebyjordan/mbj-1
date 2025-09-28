"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProjects, Project } from "@/services/projects";
import { Button } from "../ui/button";

export default function BlogPreview({ id }: { id: string }) {
  const [blogPosts, setBlogPosts] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allProjects = await getProjects();
        // Filtra los proyectos que son de tipo 'blog' y toma los últimos 3.
        const featuredPosts = allProjects.filter(p => p.type === 'blog').slice(0, 3);
        setBlogPosts(featuredPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return (
        <section id={id} className="py-20 md:py-32 w-full">
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </section>
    );
  }

  if (blogPosts.length === 0) {
    return null; // No renderizar la sección si no hay posts
  }


  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <div className="text-center">
        <h2 className="section-title">Desde el Blog</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Mis últimas reflexiones sobre diseño, tecnología y cómo construir grandes cosas.
        </p>
      </div>
      <div className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => {
              const postUrl = `/portfolio/${post.id}`;
              return (
              <Card key={post.id} className="glass-card overflow-hidden group">
                <CardHeader className="p-0">
                  <Link href={postUrl}>
                    <Image
                      src={post.imageUrl || 'https://placehold.co/600x400'}
                      alt={post.title || 'Imagen del post'}
                      width={600}
                      height={400}
                      data-ai-hint={post.imageHint}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="font-headline text-2xl">
                     <Link href={postUrl} className="hover:text-primary transition-colors">{post.title}</Link>
                  </CardTitle>
                  <p className="mt-2 text-muted-foreground line-clamp-3">{post.description}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                    <Link href={postUrl} className="flex items-center text-primary hover:text-secondary transition-colors">
                        Leer Más <ArrowUpRight className="ml-1 w-4 h-4"/>
                    </Link>
                </CardFooter>
              </Card>
            )})}
        </div>
      </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="border-primary/50 bg-transparent hover:bg-primary/10 hover:text-foreground">
            <Link href="/blog">
              Ver todas las entradas <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
    </section>
  );
}

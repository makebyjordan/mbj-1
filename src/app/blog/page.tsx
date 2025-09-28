
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { getProjects, Project } from "@/services/projects";
import { getBlogCategories, BlogCategory } from "@/services/blog-categories";
import { Loader2, ArrowUpRight, ChevronDown, FileCode } from "lucide-react";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function BlogPage() {
  const [allPosts, setAllPosts] = useState<Project[]>([]);
  const [allCategories, setAllCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsFromDb, categoriesFromDb] = await Promise.all([
          getProjects().then(p => p.filter(item => item.type === 'blog')),
          getBlogCategories()
        ]);
        setAllPosts(postsFromDb);
        setAllCategories(categoriesFromDb);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const postsByCategory = useMemo(() => {
    const grouped: { [key: string]: Project[] } = {};
    allPosts.forEach(post => {
      const categoryId = post.categoryId || 'uncategorized';
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(post);
    });
    return grouped;
  }, [allPosts]);

  const uncategorizedPosts = postsByCategory['uncategorized'] || [];
  const categorizedPosts = allCategories.filter(cat => postsByCategory[cat.id!] && postsByCategory[cat.id!].length > 0);

  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-background min-h-screen">
      <Header />
      <main className="w-full container mx-auto px-4 py-20 md:py-32 flex-grow">
        <div className="text-center mb-12">
            <h1 className="section-title">Desde el Blog</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Mis últimas reflexiones sobre diseño, tecnología y cómo construir grandes cosas.
            </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : allPosts.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg py-16">
            Aún no hay entradas en el blog. ¡Crea una desde el CORE!
          </p>
        ) : (
          <Accordion type="multiple" defaultValue={[...categorizedPosts.map(c => c.id!), 'uncategorized']} className="w-full space-y-8">
            {categorizedPosts.map(category => (
              <AccordionItem value={category.id!} key={category.id} className="border-none">
                  <Card className="glass-card overflow-hidden">
                      <AccordionTrigger className="w-full p-0 hover:no-underline [&[data-state=open]>div>div>svg]:rotate-180">
                          <CardHeader className="p-0 relative h-48 w-full">
                              <Image
                                  src={category.imageUrl}
                                  alt={category.title}
                                  fill
                                  className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-between p-4 w-full">
                                  <CardTitle className="section-title text-3xl text-center flex-1">{category.title}</CardTitle>
                                  <ChevronDown className="h-8 w-8 text-white transition-transform duration-300" />
                              </div>
                          </CardHeader>
                      </AccordionTrigger>
                      <AccordionContent>
                         <CardContent className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {postsByCategory[category.id!]?.map(post => (
                                 <Card key={post.id} className="bg-background/50 overflow-hidden group flex flex-col">
                                    <CardHeader className="p-0">
                                        <Link href={`/portfolio/${post.id}`}>
                                            <Image
                                                src={post.imageUrl || 'https://placehold.co/600x400'}
                                                alt={post.title || 'Imagen del post'}
                                                width={600}
                                                height={400}
                                                data-ai-hint={post.imageHint}
                                                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </Link>
                                    </CardHeader>
                                    <CardContent className="p-4 flex-grow">
                                        <CardTitle className="font-headline text-xl">
                                            <Link href={`/portfolio/${post.id}`} className="hover:text-primary transition-colors">{post.title}</Link>
                                        </CardTitle>
                                        <p className="mt-2 text-muted-foreground text-sm line-clamp-2">{post.description}</p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                        <Link href={`/portfolio/${post.id}`} className="flex items-center text-primary hover:text-secondary transition-colors text-sm">
                                            Leer Más <ArrowUpRight className="ml-1 w-4 h-4"/>
                                        </Link>
                                    </CardFooter>
                                </Card>
                              ))}
                          </CardContent>
                      </AccordionContent>
                  </Card>
              </AccordionItem>
            ))}
             {uncategorizedPosts.length > 0 && (
                <AccordionItem value="uncategorized" className="border-none">
                     <Card className="glass-card overflow-hidden">
                        <AccordionTrigger className="w-full p-0 hover:no-underline [&[data-state=open]>div>div>svg]:rotate-180">
                           <CardHeader className="p-0 relative h-48 w-full bg-muted">
                                <div className="absolute inset-0 flex items-center justify-between p-4 w-full">
                                    <CardTitle className="section-title text-3xl text-center flex-1">Otras Entradas</CardTitle>
                                    <ChevronDown className="h-8 w-8 text-white transition-transform duration-300" />
                                </div>
                           </CardHeader>
                        </AccordionTrigger>
                        <AccordionContent>
                           <CardContent className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {uncategorizedPosts.map(post => (
                                 <Card key={post.id} className="bg-background/50 overflow-hidden group flex flex-col">
                                    <CardHeader className="p-0">
                                        <Link href={`/portfolio/${post.id}`}>
                                            <Image
                                                src={post.imageUrl || 'https://placehold.co/600x400'}
                                                alt={post.title || 'Imagen del post'}
                                                width={600}
                                                height={400}
                                                data-ai-hint={post.imageHint}
                                                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </Link>
                                    </CardHeader>
                                    <CardContent className="p-4 flex-grow">
                                        <CardTitle className="font-headline text-xl">
                                            <Link href={`/portfolio/${post.id}`} className="hover:text-primary transition-colors">{post.title}</Link>
                                        </CardTitle>
                                        <p className="mt-2 text-muted-foreground text-sm line-clamp-2">{post.description}</p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                        <Link href={`/portfolio/${post.id}`} className="flex items-center text-primary hover:text-secondary transition-colors text-sm">
                                            Leer Más <ArrowUpRight className="ml-1 w-4 h-4"/>
                                        </Link>
                                    </CardFooter>
                                </Card>
                              ))}
                          </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>
            )}
          </Accordion>
        )}
      </main>
      <Footer />
    </div>
  );
}

    
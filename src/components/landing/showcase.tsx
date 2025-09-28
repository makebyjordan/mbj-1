"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProjects, Project } from "@/services/projects";

export default function Showcase({ id }: { id: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await getProjects();
        // Filtra los proyectos que son de tipo 'project'.
        const portfolioProjects = allProjects.filter(p => p.type === 'project');
        setProjects(portfolioProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <div className="text-center">
        <h2 className="section-title">Mis Creaciones</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Una selección de proyectos en los que he puesto mi corazón y mi alma.
        </p>
      </div>
      <div className="mt-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center text-muted-foreground">Aún no hay proyectos en el portafolio. ¡Crea uno desde el CORE!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
               const projectUrl = project.url || `/portfolio/${project.id}`;
               return (
              <Card key={project.id} className="glass-card overflow-hidden group">
                <CardHeader className="p-0">
                  <Image
                    src={project.imageUrl || 'https://placehold.co/600x400'}
                    alt={project.description || 'Imagen del proyecto'}
                    width={600}
                    height={400}
                    data-ai-hint={project.imageHint}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="font-headline text-2xl">
                    {project.title}
                  </CardTitle>
                  <p className="mt-2 text-muted-foreground">{project.description}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                    <Link href={projectUrl} target={project.url ? "_blank" : "_self"} className="flex items-center text-primary hover:text-secondary transition-colors">
                        Ver Proyecto <ArrowUpRight className="ml-1 w-4 h-4"/>
                    </Link>
                </CardFooter>
              </Card>
            )})}
          </div>
        )}
      </div>
    </section>
  );
}
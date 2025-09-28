
"use client";

import { useEffect, useState } from "react";
import { getProjectById, Project } from "@/services/projects";
import { notFound } from 'next/navigation';
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Estilos para el contenido HTML importado
const proseStyles = `
  prose-invert 
  prose-p:text-muted-foreground prose-p:text-lg 
  prose-headings:text-foreground prose-headings:font-headline
  prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
  prose-a:text-primary hover:prose-a:text-secondary
  prose-strong:text-foreground
  prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
  prose-ul:list-disc prose-ol:list-decimal
  prose-li:marker:text-primary
  max-w-full
`;


export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    const { id } = params;
    if (!id) return;
    
    const fetchProject = async () => {
      try {
        const fetchedProject = await getProjectById(id);
        setProject(fetchedProject);
      } catch (error) {
        console.error("Error fetching project:", error);
        setProject(null);
      }
    };
    fetchProject();
  }, [params]);

  if (project === undefined) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (project === null) {
    notFound();
  }

  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-background min-h-screen">
      <Header />
      <main className="w-full container mx-auto px-4 py-20 md:py-32 flex-grow">
        <article className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">{project.type === 'blog' ? 'Blog' : 'Proyecto'}</Badge>
          <h1 className="section-title mb-4">{project.title}</h1>
          <p className="text-xl text-muted-foreground mb-8">{project.description}</p>
          
          {project.imageUrl && (
             <div className="relative w-full h-96 rounded-lg overflow-hidden mb-12">
                <Image
                    src={project.imageUrl}
                    alt={project.title || 'Project Image'}
                    fill
                    className="object-cover"
                />
             </div>
          )}
          
          {project.htmlContent ? (
             <Card className="glass-card">
                <CardContent className="p-6 md:p-8">
                   <div 
                      className={proseStyles}
                      dangerouslySetInnerHTML={{ __html: project.htmlContent }} 
                    />
                </CardContent>
             </Card>
          ) : (
            <p className="text-muted-foreground text-center py-10">No hay contenido adicional para este proyecto.</p>
          )}

        </article>
      </main>
      <Footer />
    </div>
  );
}

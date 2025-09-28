
"use client";

import { useEffect, useState, useRef } from "react";
import { getProjectById, Project } from "@/services/projects";
import { notFound } from 'next/navigation';
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const projectId = params.id;
    if (!projectId) return;
    
    const fetchProject = async () => {
      try {
        const fetchedProject = await getProjectById(projectId);
        setProject(fetchedProject);
      } catch (error) {
        console.error("Error fetching project:", error);
        setProject(null);
      }
    };
    fetchProject();
  }, [params.id]);
  
  useEffect(() => {
    if (project?.htmlContent && iframeRef.current) {
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
            doc.open();
            doc.write(project.htmlContent);
            doc.close();
        }
    }
  }, [project]);


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
             <div className="relative w-full h-96 rounded-lg overflow-hidden mb-12 shadow-lg">
                <Image
                    src={project.imageUrl}
                    alt={project.title || 'Project Image'}
                    fill
                    className="object-cover"
                />
             </div>
          )}
          
          {project.htmlContent ? (
             <div className="mt-8 rounded-lg border border-primary/20 overflow-hidden bg-white">
                <iframe
                    ref={iframeRef}
                    title="Contenido del Proyecto"
                    className="w-full h-[600px] border-none"
                    sandbox="allow-scripts allow-same-origin"
                />
             </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">No hay contenido adicional para este proyecto.</p>
          )}

        </article>
      </main>
      <Footer />
    </div>
  );
}

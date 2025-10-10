
"use client";

import { useEffect, useState, useRef } from "react";
import { getN8NTemplateById, N8NTemplate } from "@/services/n8n-templates";
import { notFound, useParams } from 'next/navigation';
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Loader2 } from "lucide-react";

export default function N8NAprendePage() {
  const [template, setTemplate] = useState<N8NTemplate | null | undefined>(undefined);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const params = useParams();
  const templateId = params.id as string;

  useEffect(() => {
    if (!templateId) return;
    
    const fetchTemplate = async () => {
      try {
        const fetchedTemplate = await getN8NTemplateById(templateId);
        setTemplate(fetchedTemplate);
      } catch (error) {
        console.error("Error fetching template:", error);
        setTemplate(null);
      }
    };
    fetchTemplate();
  }, [templateId]);
  
  useEffect(() => {
    if (template?.htmlContent && iframeRef.current) {
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
            doc.open();
            doc.write(template.htmlContent);
            doc.close();
        }
    }
  }, [template]);


  if (template === undefined) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (template === null || !template.htmlContent) {
    notFound();
  }

  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-background min-h-screen">
      <Header />
      <main className="w-full container mx-auto px-4 py-20 md:py-32 flex-grow">
        <article className="max-w-4xl mx-auto">
          <h1 className="section-title mb-8">{template.title}</h1>
          
          <div className="mt-8 rounded-lg border border-primary/20 overflow-hidden bg-white">
            <iframe
                ref={iframeRef}
                title="Contenido de la Plantilla"
                className="w-full h-[80vh] border-none"
                sandbox="allow-scripts allow-same-origin"
            />
          </div>

        </article>
      </main>
      <Footer />
    </div>
  );
}

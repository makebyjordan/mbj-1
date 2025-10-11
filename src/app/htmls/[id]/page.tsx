
"use client";

import { useEffect, useState, useRef } from "react";
import { getHtmlById, HtmlPage } from "@/services/htmls";
import { notFound, useParams } from 'next/navigation';
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Loader2 } from "lucide-react";

export default function HtmlViewPage() {
  const [htmlPage, setHtmlPage] = useState<HtmlPage | null | undefined>(undefined);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const params = useParams();
  const pageId = params.id as string;

  useEffect(() => {
    if (!pageId) return;
    
    const fetchHtmlPage = async () => {
      try {
        const fetchedPage = await getHtmlById(pageId);
        setHtmlPage(fetchedPage);
      } catch (error) {
        console.error("Error fetching HTML page:", error);
        setHtmlPage(null);
      }
    };
    fetchHtmlPage();
  }, [pageId]);
  
  useEffect(() => {
    if (htmlPage?.htmlContent && iframeRef.current) {
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
            doc.open();
            doc.write(htmlPage.htmlContent);
            doc.close();
        }
    }
  }, [htmlPage]);


  if (htmlPage === undefined) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (htmlPage === null || !htmlPage.htmlContent) {
    notFound();
  }

  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-white min-h-screen">
      <div className="w-full h-full">
        <iframe
            ref={iframeRef}
            title={htmlPage.title}
            className="w-full h-screen border-none"
            sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}

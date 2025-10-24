
"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from 'next/navigation';
import { getGitProtocolById, GitProtocol } from "@/services/git";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Loader2, Terminal, Copy } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function GitProtocolDetailPage() {
  const [protocol, setProtocol] = useState<GitProtocol | null | undefined>(undefined);
  const params = useParams();
  const protocolId = params.id as string;
  const { toast } = useToast();

  useEffect(() => {
    if (!protocolId) return;
    
    const fetchProtocol = async () => {
      try {
        const fetchedProtocol = await getGitProtocolById(protocolId);
        setProtocol(fetchedProtocol);
      } catch (error) {
        console.error("Error fetching Git protocol:", error);
        setProtocol(null);
      }
    };
    fetchProtocol();
  }, [protocolId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: "Comando copiado al portapapeles." });
  };

  if (protocol === undefined) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (protocol === null) {
    notFound();
  }

  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-background min-h-screen">
      <Header />
      <main className="w-full container mx-auto px-4 py-20 md:py-32 flex-grow">
        <article className="max-w-4xl mx-auto">
          <h1 className="section-title mb-4">{protocol.title}</h1>
          {protocol.description && (
            <p className="text-xl text-muted-foreground mb-12">{protocol.description}</p>
          )}
          
          <div className="space-y-12">
            {protocol.steps?.map((step, index) => (
              <div key={index} className="space-y-4">
                {step.gitCommand && (
                  <div className="bg-black rounded-lg p-4 font-mono text-sm relative group">
                    <pre className="text-white whitespace-pre-wrap">
                      <code>
                        <Terminal className="inline-block h-4 w-4 mr-2 text-green-400" />
                        {step.gitCommand}
                      </code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-7 w-7 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(step.gitCommand!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {step.description && (
                  <p className="text-muted-foreground">{step.description}</p>
                )}
                {step.imageUrl && (
                  <div className="relative w-full h-auto rounded-lg overflow-hidden mt-4 shadow-lg">
                    <Image
                        src={step.imageUrl}
                        alt={`Visual for step ${index + 1}`}
                        width={800}
                        height={450}
                        className="object-contain"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

    
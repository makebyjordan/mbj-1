
"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { getFormations, Formation } from "@/services/formation";
import { Loader2, Award, ArrowUpRight } from "lucide-react";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AprendePage() {
  const [courses, setCourses] = useState<Formation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const tag = params.tag as string;

  useEffect(() => {
    if (!tag) return;

    const fetchCourses = async () => {
      try {
        const allFormations = await getFormations();
        const filteredCourses = allFormations.filter(
          (formation) => formation.tag === tag
        );
        setCourses(filteredCourses);
      } catch (error) {
        console.error("Error fetching courses by tag:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [tag]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!courses.length) {
    // This will show a 404 if no courses are found for that tag, 
    // which is reasonable as it means the tag doesn't exist or has no content.
    notFound();
  }
  
  const pageTitle = tag.replace(/-/g, ' ');

  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-background min-h-screen">
      <Header />
      <main className="w-full container mx-auto px-4 py-20 md:py-32 flex-grow">
         <div className="text-center mb-12">
            <h1 className="section-title capitalize">Aprende sobre {pageTitle}</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Una colección de cursos y recursos para dominar {pageTitle}.
            </p>
        </div>

        <div className="max-w-4xl mx-auto">
             <div className="space-y-8">
                {courses.map((item) => (
                <Card key={item.id} className="glass-card">
                    <CardHeader className="flex flex-row items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-full mt-1">
                            <Award className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-2xl">{item.title}</CardTitle>
                            <CardDescription className="text-muted-foreground">{item.description}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {item.url && (
                            <Link href={item.url} target="_blank" className="inline-flex items-center text-primary hover:text-secondary transition-colors text-sm">
                                Ir al curso <ArrowUpRight className="ml-1 w-4 h-4"/>
                            </Link>
                        )}
                    </CardContent>
                </Card>
                ))}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

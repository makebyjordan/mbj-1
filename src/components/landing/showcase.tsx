import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const projects = PlaceHolderImages.filter(img => img.id.startsWith("project-"));

export default function Showcase({ id }: { id: string }) {
  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <div className="text-center">
        <h2 className="section-title">Mis Creaciones</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Una selección de proyectos en los que he puesto mi corazón y mi alma.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <Card key={project.id} className="glass-card overflow-hidden group">
            <CardHeader className="p-0">
              <Image
                src={project.imageUrl}
                alt={project.description}
                width={600}
                height={400}
                data-ai-hint={project.imageHint}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="font-headline text-2xl">
                {(project as any).title}
              </CardTitle>
              <p className="mt-2 text-muted-foreground">{project.description}</p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
                <Link href="#" className="flex items-center text-primary hover:text-secondary transition-colors">
                    Ver Proyecto <ArrowUpRight className="ml-1 w-4 h-4"/>
                </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

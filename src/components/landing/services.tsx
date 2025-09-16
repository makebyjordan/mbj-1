import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeXml, Palette, Lightbulb, Megaphone, Newspaper, Briefcase } from "lucide-react";

const services = [
  {
    icon: <CodeXml className="w-10 h-10 text-primary" />,
    title: "Desarrollo Web",
    description: "Construyendo sitios web rápidos, responsivos y hermosos desde cero.",
  },
  {
    icon: <Palette className="w-10 h-10 text-primary" />,
    title: "Branding",
    description: "Creando identidades de marca únicas que resuenan con tu público objetivo.",
  },
  {
    icon: <Lightbulb className="w-10 h-10 text-primary" />,
    title: "Incubación de Proyectos",
    description: "Dando vida a tus ideas, desde el concepto hasta un negocio completamente desarrollado.",
  },
  {
    icon: <Megaphone className="w-10 h-10 text-primary" />,
    title: "Creación de Contenido",
    description: "Elaborando contenido atractivo que capta la atención y genera resultados.",
  },
  {
    icon: <Newspaper className="w-10 h-10 text-primary" />,
    title: "Noticias y Análisis",
    description: "Proporcionando noticias curadas y análisis de expertos sobre las últimas tendencias de la industria.",
  },
  {
    icon: <Briefcase className="w-10 h-10 text-primary" />,
    title: "Formación y Capacitación",
    description: "Empoderando a individuos y equipos con habilidades y conocimientos de vanguardia.",
  },
];

export default function Services({ id }: { id: string }) {
  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <div className="text-center">
        <h2 className="section-title">Lo Que Hago</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Me especializo en una gama de servicios creativos y técnicos para dar vida a tu visión.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Card key={service.title} className="glass-card text-center pt-6 transform transition-transform duration-300 hover:-translate-y-2">
            <CardHeader className="items-center">
              <div className="p-4 bg-primary/10 rounded-full">
                {service.icon}
              </div>
              <CardTitle className="font-headline text-2xl mt-4">{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

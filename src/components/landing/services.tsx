import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeXml, Palette, Lightbulb, Megaphone, Newspaper, Briefcase } from "lucide-react";

const services = [
  {
    icon: <CodeXml className="w-10 h-10 text-primary" />,
    title: "Web Development",
    description: "Building fast, responsive, and beautiful websites from the ground up.",
  },
  {
    icon: <Palette className="w-10 h-10 text-primary" />,
    title: "Branding",
    description: "Creating unique brand identities that resonate with your target audience.",
  },
  {
    icon: <Lightbulb className="w-10 h-10 text-primary" />,
    title: "Project Incubation",
    description: "Bringing your ideas to life, from concept to a fully-fledged business.",
  },
  {
    icon: <Megaphone className="w-10 h-10 text-primary" />,
    title: "Content Creation",
    description: "Crafting engaging content that captures attention and drives results.",
  },
  {
    icon: <Newspaper className="w-10 h-10 text-primary" />,
    title: "News & Insights",
    description: "Providing curated news and expert analysis on the latest industry trends.",
  },
  {
    icon: <Briefcase className="w-10 h-10 text-primary" />,
    title: "Formation & Training",
    description: "Empowering individuals and teams with cutting-edge skills and knowledge.",
  },
];

export default function Services({ id }: { id: string }) {
  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <div className="text-center">
        <h2 className="section-title">What I Do</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          I specialize in a range of creative and technical services to bring your vision to life.
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

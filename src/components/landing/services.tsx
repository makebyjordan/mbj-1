
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getServices, Service } from "@/services/services";
import Link from "next/link";

export default function Services({ id }: { id: string }) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesFromDb = await getServices();
        setServices(servicesFromDb);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section id={id} className="py-20 md:py-32 w-full">
      <div className="text-center">
        <h2 className="section-title">Lo Que Hago</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Me especializo en una gama de servicios creativos y técnicos para dar vida a tu visión.
        </p>
      </div>
      <div className="mt-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : services.length === 0 ? (
          <p className="text-center text-muted-foreground">Aún no hay servicios. ¡Crea uno desde el CORE!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="glass-card text-center pt-6 transform transition-transform duration-300 hover:-translate-y-2 flex flex-col">
                <CardHeader className="items-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    {service.iconUrl && <img src={service.iconUrl} alt={service.title} className="w-10 h-10" />}
                  </div>
                  <CardTitle className="font-headline text-2xl mt-4">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
                {service.url && (
                    <CardFooter className="justify-center pt-4">
                        <Link href={service.url} target="_blank" className="flex items-center text-primary hover:text-secondary transition-colors">
                            Saber más <ArrowUpRight className="ml-1 w-4 h-4"/>
                        </Link>
                    </CardFooter>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

    
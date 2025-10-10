
"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { getAprendePageById, AprendePageData } from "@/services/aprende-pages";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// --- Secciones Renderizables ---

const HeroSection = ({ pageData }: { pageData: AprendePageData }) => (
    <section className="relative w-full min-h-[60vh] flex flex-col items-center justify-center text-center py-20 md:py-32 overflow-hidden">
        {pageData.heroImageUrl && (
            <div className="absolute inset-0 w-full h-full z-0">
                <Image src={pageData.heroImageUrl} alt={pageData.heroTitle || 'Hero background'} fill className="object-cover" quality={100} priority />
                <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>
        )}
        <div className="z-10 container px-4">
            <h1 className="section-title text-4xl md:text-6xl">{pageData.heroTitle}</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground font-light">{pageData.heroDescription}</p>
            {pageData.heroCtaText && pageData.heroCtaUrl && (
                <div className="mt-8">
                    <Button asChild size="lg" className="primary-button-glow text-lg px-8 py-6 rounded-full">
                        <Link href={pageData.heroCtaUrl}>{pageData.heroCtaText}</Link>
                    </Button>
                </div>
            )}
        </div>
    </section>
);

const FeatureSection = ({ pageData }: { pageData: AprendePageData }) => (
    <section className="py-20 md:py-32 w-full">
        <div className="text-center max-w-3xl mx-auto">
            <h2 className="section-title">{pageData.featureSectionTitle}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{pageData.featureSectionDescription}</p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pageData.featureSectionCards?.map((card, index) => (
                <Card key={index} className="glass-card text-center pt-6 flex flex-col">
                    <CardHeader className="items-center">
                        {card.icon && <div className="p-4 bg-primary/10 rounded-full" dangerouslySetInnerHTML={{ __html: card.icon }}></div>}
                        <CardTitle className="font-headline text-2xl mt-4">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground">{card.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
        {pageData.featureSectionCtaText && pageData.featureSectionCtaUrl && (
             <div className="text-center mt-12">
                <Button asChild size="lg" variant="outline">
                    <Link href={pageData.featureSectionCtaUrl}>
                        {pageData.featureSectionCtaText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        )}
    </section>
);

const IconListSection = ({ pageData }: { pageData: AprendePageData }) => (
    <section className="py-20 md:py-32 w-full">
        <div className="max-w-4xl mx-auto">
            <p className="text-center text-xl font-semibold text-muted-foreground mb-12">{pageData.iconListSectionDescription}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center">
                {pageData.iconListSectionItems?.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-4">
                        {item.icon && <div className="w-16 h-16" dangerouslySetInnerHTML={{ __html: item.icon }}></div>}
                        <h3 className="font-headline text-2xl">{item.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const MediaGridSection = ({ pageData }: { pageData: AprendePageData }) => (
    <section className="py-20 md:py-32 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pageData.mediaGridSectionCards?.map((card, index) => (
                <Card key={index} className="glass-card overflow-hidden group">
                    <CardHeader className="p-0">
                        {card.imageUrl && <Image src={card.imageUrl} alt={card.title || ""} width={600} height={400} className="w-full h-48 object-cover" />}
                        {card.videoUrl && !card.imageUrl && <iframe src={card.videoUrl} className="w-full h-48" allowFullScreen></iframe>}
                    </CardHeader>
                    <CardContent className="p-6">
                        <CardTitle className="font-headline text-2xl">{card.title}</CardTitle>
                        <p className="mt-2 text-muted-foreground line-clamp-3">{card.description}</p>
                    </CardContent>
                    {card.ctaText && card.ctaUrl && (
                         <CardContent className="p-6 pt-0">
                             <Button asChild variant="link" className="p-0 text-primary">
                                <Link href={card.ctaUrl} target="_blank">{card.ctaText} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                         </CardContent>
                    )}
                </Card>
            ))}
        </div>
    </section>
);

const PricingSection = ({ pageData }: { pageData: AprendePageData }) => (
    <section className="py-20 md:py-32 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {pageData.pricingSectionCards?.map((card, index) => (
                <div key={index} dangerouslySetInnerHTML={{ __html: card.htmlContent }}></div>
            ))}
        </div>
    </section>
);

const FullWidthMediaSection = ({ pageData }: { pageData: AprendePageData }) => (
    <section className="relative py-32 md:py-48 w-full my-16 flex items-center justify-center text-center">
         {(pageData.fullWidthMediaSectionImageUrl || pageData.fullWidthMediaSectionVideoUrl) && (
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden rounded-lg">
                {pageData.fullWidthMediaSectionImageUrl ? (
                    <Image src={pageData.fullWidthMediaSectionImageUrl} alt={pageData.fullWidthMediaSectionTitle || ''} fill className="object-cover" />
                ) : pageData.fullWidthMediaSectionVideoUrl && (
                    <video src={pageData.fullWidthMediaSectionVideoUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                )}
                <div className="absolute inset-0 bg-black/60"></div>
            </div>
         )}
        <div className="z-10 container">
            <h2 className="section-title text-4xl text-white">{pageData.fullWidthMediaSectionTitle}</h2>
            <p className="mt-4 text-xl text-slate-300 max-w-2xl mx-auto">{pageData.fullWidthMediaSectionDescription}</p>
        </div>
    </section>
);

const FaqSection = ({ pageData }: { pageData: AprendePageData }) => (
    <section className="py-20 md:py-32 w-full">
        <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center mb-12">Preguntas Frecuentes</h2>
             <Accordion type="single" collapsible className="w-full space-y-4">
                {pageData.faqSectionItems?.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index} className="border-none">
                        <Card className="glass-card">
                            <AccordionTrigger className="text-left p-6 hover:no-underline">
                               <span className="font-headline text-xl">{item.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6">
                                <p className="text-muted-foreground">{item.answer}</p>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                ))}
             </Accordion>
        </div>
    </section>
);

const CtaSection = ({ pageData }: { pageData: AprendePageData }) => (
    <section className="py-20 md:py-32 w-full bg-primary/10 rounded-lg my-16">
        <div className="container text-center">
            <h2 className="section-title">{pageData.ctaSectionTitle}</h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto text-muted-foreground">{pageData.ctaSectionDescription}</p>
            {pageData.ctaSectionButtonText && (
                 <div className="mt-8">
                    <Button asChild size="lg" className="primary-button-glow">
                        <Link href={pageData.ctaSectionButtonUrl || '#'}>{pageData.ctaSectionButtonText}</Link>
                    </Button>
                </div>
            )}
        </div>
    </section>
);

const OpenQuestionnaireSection = ({ pageData }: { pageData: AprendePageData }) => (
    <section className="py-20 md:py-32 w-full">
        <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center mb-4">{pageData.openQuestionnaireTitle}</h2>
            <form className="space-y-6 mt-12">
                {pageData.openQuestionnaireItems?.map((item, index) => (
                    <div key={index}>
                        <Label htmlFor={`openq-${index}`} className="text-lg">{item.question}</Label>
                        <Textarea id={`openq-${index}`} className="mt-2 bg-background/50" />
                    </div>
                ))}
                <Button type="submit" className="w-full primary-button-glow">Enviar Respuestas</Button>
            </form>
        </div>
    </section>
);

const CheckboxQuestionnaireSection = ({ pageData }: { pageData: AprendePageData }) => (
    <section className="py-20 md:py-32 w-full">
         <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center mb-12">{pageData.checkboxQuestionnaireTitle}</h2>
            <form className="space-y-8">
                {pageData.checkboxQuestionnaireItems?.map((item, qIndex) => (
                    <div key={qIndex} className="p-6 rounded-lg border bg-card/50">
                        <p className="text-lg font-semibold mb-4">{item.question}</p>
                        <div className="space-y-2">
                        {item.options.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-center space-x-2">
                                <Checkbox id={`check-${qIndex}-${oIndex}`} />
                                <Label htmlFor={`check-${qIndex}-${oIndex}`} className="font-normal text-muted-foreground">{opt.label}</Label>
                            </div>
                        ))}
                        </div>
                    </div>
                ))}
                <Button type="submit" className="w-full primary-button-glow">Enviar Selección</Button>
            </form>
        </div>
    </section>
);

const ContactFormSection = ({ pageData }: { pageData: AprendePageData }) => {
    const fields = [
        { show: pageData.contactFormShowName, id: "name", label: "Nombre", type: "text" },
        { show: pageData.contactFormShowEmail, id: "email", label: "Email", type: "email" },
        { show: pageData.contactFormShowPhone, id: "phone", label: "Teléfono", type: "tel" },
        { show: pageData.contactFormShowInstagram, id: "instagram", label: "Instagram", type: "text" },
        { show: pageData.contactFormShowFacebook, id: "facebook", label: "Facebook", type: "text" },
        { show: pageData.contactFormShowLinkedIn, id: "linkedin", label: "LinkedIn", type: "text" },
        { show: pageData.contactFormShowTikTok, id: "tiktok", label: "TikTok", type: "text" },
    ];
    
    return (
    <section className="py-20 md:py-32 w-full">
         <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center mb-12">{pageData.contactFormTitle}</h2>
            <form className="space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {fields.filter(f => f.show).map(field => (
                        <div key={field.id}>
                            <Label htmlFor={field.id}>{field.label}</Label>
                            <Input id={field.id} type={field.type} className="mt-2 bg-background/50"/>
                        </div>
                    ))}
                </div>
                {pageData.contactFormShowTextMessage && (
                    <div>
                        <Label htmlFor="message">Mensaje</Label>
                        <Textarea id="message" className="mt-2 bg-background/50"/>
                    </div>
                )}
                <Button type="submit" className="w-full primary-button-glow">Enviar</Button>
            </form>
        </div>
    </section>
)};


// --- Página Principal ---

export default function AprendeViewPage() {
  const [pageData, setPageData] = useState<AprendePageData | null | undefined>(undefined);
  const params = useParams();
  const pageId = params.id as string;

  useEffect(() => {
    if (!pageId) return;

    const fetchPage = async () => {
      try {
        const data = await getAprendePageById(pageId);
        setPageData(data);
      } catch (error) {
        console.error("Error fetching page:", error);
        setPageData(null);
      }
    };
    fetchPage();
  }, [pageId]);

  if (pageData === undefined) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (pageData === null) {
    notFound();
  }

  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-background min-h-screen">
      <Header />
      <main className="w-full flex-grow">
        {pageData.heroEnabled && <HeroSection pageData={pageData} />}
        
        <div className="container mx-auto px-4">
            {pageData.htmlText && <div className="prose prose-invert max-w-none py-16" dangerouslySetInnerHTML={{ __html: pageData.htmlText }} />}
            {pageData.featureSectionEnabled && <FeatureSection pageData={pageData} />}
            {pageData.iconListSectionEnabled && <IconListSection pageData={pageData} />}
            {pageData.mediaGridSectionEnabled && <MediaGridSection pageData={pageData} />}
            {pageData.pricingSectionEnabled && <PricingSection pageData={pageData} />}
            {pageData.fullWidthMediaSectionEnabled && <FullWidthMediaSection pageData={pageData} />}
            {pageData.faqSectionEnabled && <FaqSection pageData={pageData} />}
            {pageData.openQuestionnaireEnabled && <OpenQuestionnaireSection pageData={pageData} />}
            {pageData.checkboxQuestionnaireEnabled && <CheckboxQuestionnaireSection pageData={pageData} />}
            {pageData.contactFormEnabled && <ContactFormSection pageData={pageData} />}
            {pageData.ctaSectionEnabled && <CtaSection pageData={pageData} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

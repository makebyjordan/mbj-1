
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getFormations, Formation } from "@/services/formation";

const navLinks = [
  { href: "/#services", label: "Servicios" },
  { href: "/#portfolio", label: "Portafolio" },
  { href: "/#about", label: "Sobre Mí" },
  { href: "/blog", label: "Blog" },
];

const mobileNavLinks = [
  { href: "/#services", label: "Servicios" },
  { href: "/#portfolio", label: "Portafolio" },
  { href: "/#about", label: "Sobre Mí" },
  { href: "/blog", label: "Blog" },
  { href: "/#latest-shorts", label: "Shorts" },
  { href: "/#formation", label: "Formación" },
  { href: "/links", label: "Enlaces" },
  { href: "/prompts", label: "Prompts" },
  { href: "/#news", label: "Noticias" },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formationTags, setFormationTags] = useState<string[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    const fetchTags = async () => {
      try {
        const formations = await getFormations();
        const tags = new Set(formations.map(f => f.tag).filter(Boolean) as string[]);
        setFormationTags(Array.from(tags));
      } catch (error) {
        console.error("Error fetching formation tags:", error);
      }
    };
    fetchTags();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/studio-7212735275-82dc4.firebasestorage.app/o/gallery%2F1758072438075_logo-mbj.png?alt=media&token=3b0f7574-c410-4a78-995e-f9ff88032f64";

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-lg border-b border-primary/10" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 font-headline text-2xl" aria-label="Home">
            <Image
                src={logoUrl}
                alt="Logo Make By Jordan"
                width={30}
                height={30}
                className="h-20 w-auto"
                quality={100}
                priority
            />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
                >
                {link.label}
                </Link>
            ))}
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground transition-colors hover:text-foreground px-0 hover:bg-transparent">
                  Interés <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Formación</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                       <DropdownMenuItem asChild><Link href="/#formation">Certificaciones</Link></DropdownMenuItem>
                       <DropdownMenuItem asChild><Link href="/aprende">Aprende</Link></DropdownMenuItem>
                       <Separator />
                       {formationTags.map(tag => (
                         <DropdownMenuItem key={tag} asChild>
                           <Link href={`/aprende/${encodeURIComponent(tag)}`}>{tag.replace(/-/g, ' ')}</Link>
                         </DropdownMenuItem>
                       ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem asChild><Link href="/shorts">Shorts</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/links">Enlaces</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/prompts">Prompts</Link></DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Diseño</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem asChild><Link href="/">Me gusta</Link></DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem asChild><Link href="/n8n/login">Plantillas N8N</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button asChild className="primary-button-glow">
            <Link href="/#contact">Contáctame</Link>
          </Button>
          <Button asChild variant="outline" className="border-primary/50 bg-transparent hover:bg-primary/10 hover:text-foreground">
            <Link href="/core/login">CORE</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
               <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background/90 backdrop-blur-lg p-0">
                <ScrollArea className="h-full w-full">
                    <div className="p-6">
                        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                        <nav className="flex flex-col gap-6 text-lg font-medium pt-4">
                            <Link href="/" className="flex items-center gap-2 font-headline text-2xl mb-4" onClick={() => setIsMobileMenuOpen(false)}>
                                <Image src={logoUrl} alt="Logo Make By Jordan" width={30} height={30} className="h-20 w-auto"/>
                            </Link>
                            {mobileNavLinks.map((link) => (
                                <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                {link.label}
                                </Link>
                            ))}
                            
                            <Separator className="my-4 bg-primary/20" />

                            <div className="flex flex-col gap-4">
                                <Button asChild className="primary-button-glow" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Link href="/#contact">Contáctame</Link>
                                </Button>
                                <Button asChild variant="outline" className="border-primary/50 bg-transparent hover:bg-primary/10 hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Link href="/core/login">CORE</Link>
                                </Button>
                            </div>
                        </nav>
                    </div>
                </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

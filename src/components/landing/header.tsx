"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MountainIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#services", label: "Servicios" },
  { href: "#portfolio", label: "Portafolio" },
  { href: "#about", label: "Sobre Mí" },
  { href: "#blog", label: "Blog" },
  { href: "#news", label: "Noticias" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-lg border-b border-primary/10" : "bg-transparent"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-headline text-2xl" aria-label="Home">
          <MountainIcon className="h-6 w-6 text-primary" />
          <span className="font-bold">El Lienzo de Jordan</span>
        </Link>
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
        </nav>
        <div className="flex items-center gap-4">
          <Button asChild className="primary-button-glow">
            <Link href="/#contact">Contáctame</Link>
          </Button>
          <Button asChild variant="outline" className="border-primary/50 bg-transparent hover:bg-primary/10 hover:text-foreground">
            <Link href="/core/login">CORE</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

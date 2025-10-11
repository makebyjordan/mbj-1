
import { Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/studio-7212735275-82dc4.firebasestorage.app/o/gallery%2F1758072438075_logo-mbj.png?alt=media&token=3b0f7574-c410-4a78-995e-f9ff88032f64";

  return (
    <footer className="w-full border-t border-primary/10 mt-20 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Columna Logo y Copyright */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logoUrl}
                alt="Logo MakeByJordan"
                width={20}
                height={20}
                className="h-20 w-auto"
              />
            </Link>
             <p className="text-muted-foreground text-sm mt-2">
                &copy; {new Date().getFullYear()} MakeByJordan. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4 mt-4">
                <Link href="https://x.com/makebyjordan" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
                <Link href="https://www.instagram.com/makebyjordan" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
                <Link href="https://www.linkedin.com/in/makebyjordan/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
                <Link href="https://www.youtube.com/@makebyjordan" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <Youtube className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
            </div>
        </div>
        
        {/* Columna Navegación Principal */}
        <div className="text-center md:text-left">
          <h3 className="font-headline text-lg text-foreground mb-4">Navegación</h3>
          <div className="flex flex-col gap-2">
            <Link href="/#services" className="text-muted-foreground hover:text-primary transition-colors">Servicios</Link>
            <Link href="/#portfolio" className="text-muted-foreground hover:text-primary transition-colors">Portafolio</Link>
            <Link href="/#about" className="text-muted-foreground hover:text-primary transition-colors">Sobre Mí</Link>
            <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link>
             <Link href="/#contact" className="text-muted-foreground hover:text-primary transition-colors">Contacto</Link>
          </div>
        </div>

        {/* Columna Formación */}
        <div className="text-center md:text-left">
          <h3 className="font-headline text-lg text-foreground mb-4">Formación</h3>
          <div className="flex flex-col gap-2">
            <Link href="/#formation" className="text-muted-foreground hover:text-primary transition-colors">Certificaciones</Link>
            <Link href="/aprende" className="text-muted-foreground hover:text-primary transition-colors">Cursos</Link>
            <Link href="/aprende" className="text-muted-foreground hover:text-primary transition-colors">Aprende</Link>
            <Link href="/n8n/login" className="text-muted-foreground hover:text-primary transition-colors">Plantillas N8N</Link>
            <Link href="/htmls" className="text-muted-foreground hover:text-primary transition-colors">Didácticos</Link>
          </div>
        </div>
        
        {/* Columna Recursos */}
        <div className="text-center md:text-left">
            <h3 className="font-headline text-lg text-foreground mb-4">Recursos</h3>
            <div className="flex flex-col gap-2">
                <Link href="/shorts" className="text-muted-foreground hover:text-primary transition-colors">Shorts</Link>
                <Link href="/links" className="text-muted-foreground hover:text-primary transition-colors">Enlaces</Link>
                <Link href="/prompts" className="text-muted-foreground hover:text-primary transition-colors">Prompts</Link>
                 <Link href="/#news" className="text-muted-foreground hover:text-primary transition-colors block">Noticias</Link>
            </div>
        </div>

      </div>
    </footer>
  );
}

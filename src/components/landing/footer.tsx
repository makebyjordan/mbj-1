
import { Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/studio-7212735275-82dc4.firebasestorage.app/o/gallery%2F1758072438075_logo-mbj.png?alt=media&token=3b0f7574-c410-4a78-995e-f9ff88032f64";

  return (
    <footer className="w-full border-t border-primary/10 mt-20 py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logoUrl}
                alt="Logo MakeByJordan"
                width={20}
                height={20}
                className="h-20 w-auto"
              />
              <span className="font-bold font-headline text-lg"></span>
            </Link>
             <p className="text-muted-foreground text-sm mt-2">
                &copy; {new Date().getFullYear()} MakeByJordan. Todos los derechos reservados.
            </p>
        </div>
        
        <div className="flex flex-col gap-2">
            <h4 className="font-headline text-lg text-foreground mb-2">Navegación</h4>
            <Link href="/#latest-shorts" className="text-muted-foreground hover:text-primary transition-colors">Shorts</Link>
            <Link href="/#formation" className="text-muted-foreground hover:text-primary transition-colors">Formación</Link>
            <Link href="/links" className="text-muted-foreground hover:text-primary transition-colors">Enlaces</Link>
            <Link href="/#news" className="text-muted-foreground hover:text-primary transition-colors">Noticias</Link>
        </div>

        <div className="flex flex-col items-center md:items-end">
            <h4 className="font-headline text-lg text-foreground mb-2">Social</h4>
            <div className="flex items-center gap-4">
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
      </div>
    </footer>
  );
}

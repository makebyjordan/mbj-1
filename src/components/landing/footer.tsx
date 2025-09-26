
import { Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/studio-7212735275-82dc4.firebasestorage.app/o/gallery%2F1758072438075_logo-mbj.png?alt=media&token=3b0f7574-c410-4a78-995e-f9ff88032f64";

  return (
    <footer className="w-full border-t border-primary/10 mt-20 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2">
            {/* Reemplaza el icono de la montaña con tu logo */}
            <Image
              src={logoUrl}
              alt="Logo MakeByJordan"
              width={20} // Ajusta el ancho según lo necesites
              height={20} // Ajusta el alto según lo necesites
              className="h-20 w-auto"
            />
            <span className="font-bold font-headline text-lg"></span>
        </div>
        <p className="text-muted-foreground text-sm mt-4 md:mt-0">
          &copy; {new Date().getFullYear()} MakeByJordan. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
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
    </footer>
  );
}

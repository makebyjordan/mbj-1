import { Instagram, Linkedin, Twitter, MountainIcon } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-primary/10 mt-20 py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2">
            <MountainIcon className="h-5 w-5 text-primary" />
            <span className="font-bold font-headline text-lg">El Lienzo de Jordan</span>
        </div>
        <p className="text-muted-foreground text-sm mt-4 md:mt-0">
          &copy; {new Date().getFullYear()} MakeByJordan. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Link href="https://x.com/makebyjordan" aria-label="Twitter">
            <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
          <Link href="#" aria-label="Instagram">
            <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
          <Link href="#" aria-label="LinkedIn">
            <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

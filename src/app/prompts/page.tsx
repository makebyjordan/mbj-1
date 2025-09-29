
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';

export default function PromptsPage() {
  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-background min-h-screen">
      <Header />
      <main className="w-full container mx-auto px-4 py-20 md:py-32 flex-grow">
        <div className="text-center mb-12">
            <h1 className="section-title">Prompts</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Una colección de prompts para inspirar la creatividad y la generación de ideas.
            </p>
        </div>
        <div className="flex justify-center items-center h-64">
            <p className="text-center text-muted-foreground text-lg py-16">
                Contenido sobre prompts próximamente...
            </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

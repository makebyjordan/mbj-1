import Header from '@/components/landing/header';
import Hero from '@/components/landing/hero';
import Services from '@/components/landing/services';
import Showcase from '@/components/landing/showcase';
import About from '@/components/landing/about';
import Blog from '@/components/landing/blog';
import NewsSummarizer from '@/components/landing/news-summarizer';
import Contact from '@/components/landing/contact';
import Footer from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden">
      <Header />
      <main className="container mx-auto px-4 w-full">
        <Hero />
        <Services id="services" />
        <Showcase id="portfolio" />
        <About id="about" />
        <Blog id="blog" />
        <NewsSummarizer id="news" />
        <Contact id="contact" />
      </main>
      <Footer />
    </div>
  );
}

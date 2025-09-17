
import Header from '@/components/landing/header';
import Hero from '@/components/landing/hero';
import Services from '@/components/landing/services';
import Showcase from '@/components/landing/showcase';
import About from '@/components/landing/about';
import Blog from '@/components/landing/blog';
import LatestShorts from '@/components/landing/latest-shorts';
import Formation from '@/components/landing/formation';
import Links from '@/components/landing/links';
import NewsSummarizer from '@/components/landing/news-summarizer';
import Contact from '@/components/landing/contact';
import Footer from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-background">
      <Header />
      <main className="w-full" id="home">
        <Hero />
        <div className="container mx-auto px-4">
          <Services id="services" />
          <Showcase id="portfolio" />
          <About id="about" />
          <Blog id="blog" />
          <LatestShorts id="latest-shorts" />
          <Formation id="formation" />
          <Links id="links" />
          <NewsSummarizer id="news" />
          <Contact id="contact" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

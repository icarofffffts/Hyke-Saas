import Header from '@/components/header';
import Hero from '@/components/hero';
import Services from '@/components/services';
import Features from '@/components/features';
import Testimonials from '@/components/testimonials';
import FAQ from '@/components/faq';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <Features />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

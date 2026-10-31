import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { IntroLoader } from '@/components/brand/IntroLoader';
import { HomeHero } from '@/components/home/HomeHero';
import { Experiences } from '@/components/home/Experiences';
import { Founders, Graduations, Journey, Social, WhatsAppBot } from '@/components/home/HomeSections';

export default function Home() {
  return (
    <main className="bg-gaucho-snow text-gaucho-ink">
      <IntroLoader />
      <Header />
      <HomeHero />
      <Experiences />
      <Journey />
      <Founders />
      <Graduations />
      <WhatsAppBot />
      <Social />
      <Footer />
    </main>
  );
}

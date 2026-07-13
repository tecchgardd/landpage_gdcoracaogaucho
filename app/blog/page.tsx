import { Header } from '@/components/Header';
import { SocialFloat } from '@/components/SocialFloat';
import { Footer } from '@/components/Footer';
import { PublicAlbumsCarousel } from '@/components/PublicAlbumsCarousel';
import { VideoBackground } from '@/components/VideoBackground';

export default function BlogPage() {
  return <main className="min-h-screen bg-gaucho-cream text-black"><Header active="blog"/><SocialFloat/>
    <section className="relative overflow-hidden bg-black px-6 pb-16 pt-36 text-white"><VideoBackground page="blog"/><div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-gaucho-green/35"/><div className="relative mx-auto max-w-6xl"><p className="font-bold tracking-widest text-gaucho-gold">REGISTROS E MOMENTOS</p><h1 className="mt-3 font-display text-5xl font-black md:text-6xl">Álbuns de fotos</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">Formaturas, bailes e encontros registrados pelo Coração Gaúcho.</p></div></section>
    <section className="mx-auto max-w-6xl px-6 py-16"><PublicAlbumsCarousel/></section><Footer/></main>;
}

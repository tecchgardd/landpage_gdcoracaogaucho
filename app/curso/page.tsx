import { Header } from '@/components/Header';
import { SocialFloat } from '@/components/SocialFloat';
import { Footer } from '@/components/Footer';
import { PublicClassesSection } from '@/components/PublicClassesSection';

export default function CoursePage() {
  return (
    <main className="min-h-screen bg-gaucho-cream text-black">
      <Header active="curso" /><SocialFloat />
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-36">
        <p className="font-bold tracking-widest text-gaucho-red">APRENDA E VIVA A TRADIÇÃO</p>
        <h1 className="mt-3 font-display text-5xl font-black md:text-6xl">Cursos e turmas</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-black/65">Confira as turmas abertas e as próximas oportunidades cadastradas pelo Coração Gaúcho.</p>
        <div className="mt-10"><PublicClassesSection /></div>
      </section>
      <Footer />
    </main>
  );
}

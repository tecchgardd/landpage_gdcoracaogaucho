import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Rascunho jurídico: tudo marcado com <Fill> precisa ser preenchido e o texto revisado por advogado antes de publicar.
export const Fill = ({ children }: { children: React.ReactNode }) => <mark className="rounded bg-gaucho-gold/40 px-1 text-gaucho-ink">[PREENCHER: {children}]</mark>;
export const CONTACT_EMAIL = <Fill>e-mail do encarregado de dados</Fill>;

const docs = [{ href: '/privacidade', label: 'Privacidade' }, { href: '/termos', label: 'Termos de Uso' }, { href: '/cookies', label: 'Cookies' }];

export function LegalPage({ title, intro, updatedAt, current, children }: { title: string; intro: string; updatedAt: string; current: string; children: React.ReactNode }) {
  return <main className="min-h-screen bg-gaucho-paper text-gaucho-ink"><Header />
    <section className="mx-auto max-w-3xl px-6 pb-24 pt-36">
      <nav aria-label="Documentos legais" className="flex flex-wrap gap-2">{docs.map((doc) => <Link key={doc.href} href={doc.href} aria-current={doc.href === current ? 'page' : undefined} className={`rounded-full px-4 py-2 font-label text-sm font-bold uppercase tracking-wider transition ${doc.href === current ? 'bg-gaucho-ink text-white' : 'text-black/60 hover:text-black'}`}>{doc.label}</Link>)}</nav>
      <h1 className="mt-8 font-display text-4xl font-black md:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-black/50">Última atualização: {updatedAt}</p>
      <p className="mt-6 text-lg leading-relaxed text-black/75">{intro}</p>
      <div className="mt-6 [&_a]:font-bold [&_a]:text-gaucho-green [&_a]:underline-offset-2 hover:[&_a]:underline [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-black [&_h3]:mt-6 [&_h3]:font-bold [&_li]:mt-1.5 [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-black/75 [&_table]:mt-4 [&_table]:w-full [&_table]:text-left [&_table]:text-sm [&_td]:border-t [&_td]:border-black/10 [&_td]:p-2.5 [&_td]:align-top [&_th]:p-2.5 [&_th]:font-label [&_th]:uppercase [&_th]:tracking-wider [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-black/75">{children}</div>
    </section>
    <Footer />
  </main>;
}

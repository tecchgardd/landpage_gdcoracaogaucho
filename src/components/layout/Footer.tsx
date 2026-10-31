'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faClock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { BrushStroke } from '@/components/brand/BrushStroke';
import { PublicCompaniesCarousel } from '@/components/catalog/PublicCompaniesCarousel';
import { useSiteModals } from '@/components/site/SiteModals';
import { useConsent } from '@/components/consent/ConsentProvider';
import { INSTAGRAM_URL, YOUTUBE_URL, whatsappLink } from '@/components/site/whatsapp';

const linkClass = 'w-fit text-left text-white/85 transition hover:text-gaucho-brushgold';

export function Footer() {
  const { open } = useSiteModals(); const { openPreferences } = useConsent();
  return <footer className="relative overflow-hidden bg-gaucho-ink pb-32 pt-20 text-white">
    <div className="absolute inset-x-0 top-0 -rotate-[1.5deg]"><BrushStroke seed={101} color="green" className="h-3" /><BrushStroke seed={103} color="red" delay={0.15} className="-mt-1 h-3" /><BrushStroke seed={107} color="gold" delay={0.3} className="-mt-1 h-3" /></div>
    <div className="mx-auto max-w-[1400px] px-4 md:px-8">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div><span className="flex h-20 w-20 items-center justify-center rounded-full bg-gaucho-snow"><Image src="/assets/logo.jpg" alt="Grupo de Danças Coração Gaúcho" width={80} height={80} className="h-[72px] w-[72px] object-contain mix-blend-multiply" /></span><p className="mt-5 max-w-xs text-white/80">Tradição gaúcha, cultura e dança que conectam gerações desde 2012.</p><div className="mt-6 flex gap-2">{[[whatsappLink(), faWhatsapp, 'WhatsApp'], [INSTAGRAM_URL, faInstagram, 'Instagram'], [YOUTUBE_URL, faYoutube, 'YouTube']].map(([href, icon, label]) => <a key={label as string} href={href as string} target="_blank" rel="noopener noreferrer" aria-label={label as string} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg transition hover:-translate-y-1 hover:bg-gaucho-brushred"><FontAwesomeIcon icon={icon as typeof faWhatsapp} /></a>)}</div></div>
        <nav aria-label="Loja" className="flex flex-col gap-3"><p className="font-label text-sm font-bold uppercase tracking-[.3em] text-gaucho-brushgold">Loja</p><Link href="/loja?categoria=ingressos" className={linkClass}>Bailes e eventos</Link><Link href="/loja?categoria=cursos-presenciais" className={linkClass}>Turmas presenciais</Link><Link href="/loja?categoria=cursos-online" className={linkClass}>Cursos online</Link><Link href="/loja?categoria=produtos" className={linkClass}>Produtos</Link></nav>
        <nav aria-label="Área do aluno" className="flex flex-col gap-3"><p className="font-label text-sm font-bold uppercase tracking-[.3em] text-gaucho-brushgold">Área do aluno</p><Link href="/minha-conta/cursos" className={linkClass}>Meus cursos</Link><Link href="/minha-conta/ingressos" className={linkClass}>Meus ingressos</Link><Link href="/minha-conta/pedidos" className={linkClass}>Meus pedidos</Link><button onClick={() => open({ type: 'historia' })} className={linkClass}>Nossa trajetória</button></nav>
        <div className="flex flex-col gap-3"><p className="font-label text-sm font-bold uppercase tracking-[.3em] text-gaucho-brushgold">Atendimento</p><button onClick={() => open({ type: 'whatsapp' })} className={`${linkClass} font-bold text-white`}><FontAwesomeIcon icon={faWhatsapp} className="mr-2 text-[#25d366]" />+55 48 9221-0952</button><p className="text-white/85"><FontAwesomeIcon icon={faEnvelope} className="mr-2" />contato@coracaogaucho.com.br</p><p className="text-white/85"><FontAwesomeIcon icon={faClock} className="mr-2" />Seg. a sex., 13h30–22h • Sáb., 8h–12h</p></div>
      </div>
      <div className="mt-16"><p className="mb-4 font-label text-sm font-bold uppercase tracking-[.3em] text-white/40">Quem caminha com a gente</p><PublicCompaniesCarousel /></div>
      <p aria-hidden="true" className="mt-12 select-none text-center font-script text-[clamp(4rem,15vw,13rem)] leading-none text-white/[.07]">Coração Gaúcho</p>
      <nav aria-label="Documentos legais" className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white/60"><Link href="/privacidade" className="hover:text-gaucho-brushgold">Política de Privacidade</Link><Link href="/termos" className="hover:text-gaucho-brushgold">Termos de Uso</Link><Link href="/cookies" className="hover:text-gaucho-brushgold">Política de Cookies</Link><button onClick={openPreferences} className="hover:text-gaucho-brushgold">Preferências de cookies</button></nav>
      <p className="mt-4 text-center text-xs text-white/40">© {new Date().getFullYear()} Grupo de Danças Coração Gaúcho. Desenvolvido por Gardsoft.</p>
    </div>
  </footer>;
}

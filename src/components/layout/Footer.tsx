import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faClock, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FlagWave } from '@/components/ui/FlagWave';

const socialLinks = [
  { icon: faWhatsapp, label: 'WhatsApp', href: 'https://wa.me/554892210952?text=Ol%C3%A1%21%20Vim%20pelo%20site%20do%20GD%20Cora%C3%A7%C3%A3o%20Ga%C3%BAcho%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.' },
  { icon: faInstagram, label: 'Instagram', href: 'https://www.instagram.com/gdcoracaogaucho/' },
  { icon: faYoutube, label: 'YouTube', href: 'https://www.youtube.com/@nossoscaminhos_gdcoracaogaucho' }
];

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#00401d] to-[#001609] pt-12 text-white">
      <FlagWave position="top" />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 md:grid-cols-[1.1fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" aria-label="Página inicial" className="inline-block"><Image src="/assets/logo4.png" alt="Grupo de Danças Coração Gaúcho" width={110} height={110} className="object-contain drop-shadow-xl" /></Link>
          <p className="mt-4 max-w-[220px] text-sm leading-6 text-white/65">Tradição gaúcha, cultura e dança que conectam gerações desde 2012.</p>
          <div className="mt-5 flex gap-2">
            {socialLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-gaucho-gold hover:text-gaucho-gold">
                <FontAwesomeIcon icon={item.icon} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-black tracking-[.14em] text-gaucho-gold">INSTITUCIONAL</h4>
          <div className="flex flex-col gap-2.5 text-sm text-white/70">
            <Link href="/sobre" className="w-fit transition-colors hover:text-white">Sobre o Grupo</Link>
            <Link href="/curso" className="w-fit transition-colors hover:text-white">Curso de Dança</Link>
            <Link href="/bilheteria" className="w-fit transition-colors hover:text-white">Bilheteria</Link>
            <Link href="/blog" className="w-fit transition-colors hover:text-white">Blog</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-black tracking-[.14em] text-gaucho-gold">LINKS RÁPIDOS</h4>
          <div className="flex flex-col gap-2.5 text-sm text-white/70">
            <Link href="/" className="w-fit transition-colors hover:text-white">Home</Link>
            <Link href="/blog" className="w-fit transition-colors hover:text-white">Álbuns</Link>
            <Link href="/bilheteria" className="w-fit transition-colors hover:text-white">Eventos</Link>
            <Link href="/#contato" className="w-fit transition-colors hover:text-white">Contato</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-black tracking-[.14em] text-gaucho-gold">CONTATO E HORÁRIOS</h4>
          <div className="space-y-3 text-sm text-white/70">
            <a href="https://wa.me/554892210952" target="_blank" rel="noopener noreferrer" aria-label="Falar com o Coração Gaúcho no WhatsApp" className="flex items-center gap-3 transition-colors hover:text-white"><FontAwesomeIcon icon={faPhone} className="w-4 text-gaucho-gold" />+55 48 9221-0952</a>
            <a href="mailto:contato@coracaogaucho.com.br" className="flex items-center gap-3 transition-colors hover:text-white"><FontAwesomeIcon icon={faEnvelope} className="w-4 text-gaucho-gold" />contato@coracaogaucho.com.br</a>
            <p className="flex items-start gap-3"><FontAwesomeIcon icon={faClock} className="mt-0.5 w-4 text-gaucho-gold" /><span>Segunda a sexta, 13h30 às 22h00<br />Sábados, 08h00 às 12h00</span></p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/55">
        © 2025 Grupo de Danças Coração Gaúcho. Todos os direitos reservados. Desenvolvido por Gardsoft.
      </div>
    </footer>
  );
}

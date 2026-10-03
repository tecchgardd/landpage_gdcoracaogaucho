import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp, faYoutube } from '@fortawesome/free-brands-svg-icons';

const whatsappMessage = encodeURIComponent('Olá! Vim pelo site do GD Coração Gaúcho e gostaria de mais informações.');

const items = [
  { icon: faWhatsapp, label: 'WhatsApp', href: `https://wa.me/554892210952?text=${whatsappMessage}` },
  { icon: faInstagram, label: 'Instagram', href: 'https://www.instagram.com/gdcoracaogaucho/' },
  { icon: faYoutube, label: 'YouTube', href: 'https://www.youtube.com/@nossoscaminhos_gdcoracaogaucho' }
];

export function SocialFloat() {
  return (
    <div className="group fixed right-0 top-1/2 z-50 hidden -translate-y-1/2 items-center lg:flex">
      <div className="mr-2 flex -translate-x-3 flex-col gap-2 opacity-0 transition-all duration-300 ease-out pointer-events-none group-hover:translate-x-0 group-hover:opacity-100 group-hover:pointer-events-auto">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.label} do Coração Gaúcho`}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#07130d]/95 text-gaucho-gold shadow-lg shadow-black/30 backdrop-blur transition-colors hover:border-transparent hover:bg-gaucho-gold hover:text-black"
          >
            <FontAwesomeIcon icon={item.icon} />
          </a>
        ))}
      </div>
      <div className="flex h-32 w-9 shrink-0 cursor-pointer items-center justify-center rounded-l-xl border border-r-0 border-white/10 bg-[#07130d]/95 shadow-xl shadow-black/30 backdrop-blur transition-colors group-hover:border-gaucho-gold/40">
        <span className="[writing-mode:vertical-rl] text-[10px] font-black uppercase tracking-[.2em] text-gaucho-gold">Redes sociais</span>
      </div>
    </div>
  );
}

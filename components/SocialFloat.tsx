import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp, faYoutube } from '@fortawesome/free-brands-svg-icons';

const whatsappMessage = encodeURIComponent('Olá! Vim pelo site do GD Coração Gaúcho e gostaria de mais informações.');

const items = [
  { icon: faWhatsapp, label: 'Falar com o Coração Gaúcho no WhatsApp', bg: 'bg-green-600', href: `https://wa.me/554892210952?text=${whatsappMessage}` },
  { icon: faInstagram, label: 'Coração Gaúcho no Instagram', bg: 'bg-pink-600', href: 'https://www.instagram.com/gdcoracaogaucho/' },
  { icon: faYoutube, label: 'Coração Gaúcho no YouTube', bg: 'bg-red-600', href: 'https://www.youtube.com/@nossoscaminhos_gdcoracaogaucho' }
];

export function SocialFloat() {
  return (
    <div className="fixed right-0 top-1/2 z-50 hidden -translate-y-1/2 overflow-hidden rounded-l-xl shadow-2xl lg:block">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className={`${item.bg} flex h-14 w-14 items-center justify-center text-2xl text-white transition hover:w-16`}
        >
          <FontAwesomeIcon icon={item.icon} />
        </a>
      ))}
    </div>
  );
}

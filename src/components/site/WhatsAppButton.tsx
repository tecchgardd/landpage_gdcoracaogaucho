'use client';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useSiteModals } from './SiteModals';

const hiddenOn = ['/aulas', '/checkout'];

// Botão único do WhatsApp (assistente que encaminha para a pessoa certa do grupo).
export function WhatsAppButton() {
  const pathname = usePathname() ?? '/';
  const { open } = useSiteModals();
  if (hiddenOn.some((route) => pathname.startsWith(route))) return null;
  return <motion.button onClick={() => open({ type: 'whatsapp' })} aria-label="Falar com o Coração Gaúcho no WhatsApp" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: 'spring', stiffness: 240, damping: 18 }} className="group fixed bottom-5 right-5 z-[140] flex h-16 items-center gap-3 rounded-full bg-[#25d366] pl-4 pr-4 text-white shadow-[0_14px_36px_rgba(0,0,0,.28)] transition hover:pr-6 sm:bottom-6 sm:right-6">
    <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-20 motion-reduce:animate-none" />
    <FontAwesomeIcon icon={faWhatsapp} className="relative text-3xl" />
    <span className="relative hidden max-w-0 overflow-hidden whitespace-nowrap font-bold transition-all duration-500 group-hover:max-w-[200px] sm:block">Tirar dúvidas</span>
  </motion.button>;
}

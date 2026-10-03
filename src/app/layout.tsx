import type { Metadata } from 'next';
import './globals.css';
import { sans, display } from './fonts';
import { Providers } from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'Coração Gaúcho | Tradição, Cursos e Bilheteria',
  description: 'Landing page premium e bilheteria do Grupo de Danças Coração Gaúcho.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR" className={`${sans.variable} ${display.variable}`}><body><Providers>{children}</Providers></body></html>;
}

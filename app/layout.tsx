import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'Coração Gaúcho | Tradição, Cursos e Bilheteria',
  description: 'Landing page premium e bilheteria do Grupo de Danças Coração Gaúcho.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body><Providers>{children}</Providers></body></html>;
}

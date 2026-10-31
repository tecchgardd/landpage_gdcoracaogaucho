import type { Metadata } from 'next';
import './globals.css';
import { sans, display, label, script } from './fonts';
import { Providers } from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'Coração Gaúcho | Tradição, Loja e Aulas de Dança Gaúcha',
  description: 'Grupo de Danças Coração Gaúcho: bailes, cursos presenciais e online de dança gaúcha, loja oficial e área do aluno.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR" className={`${sans.variable} ${display.variable} ${label.variable} ${script.variable}`}><body><Providers>{children}</Providers></body></html>;
}

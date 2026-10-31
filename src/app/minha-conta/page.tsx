import Link from 'next/link';
import { AccountShell } from '@/components/account/AccountShell';

const cards = [
  ['/minha-conta/cursos', 'Meus cursos online', 'Continue as aulas de onde parou.', 'bg-gaucho-green text-white'],
  ['/minha-conta/ingressos', 'Meus ingressos', 'QR codes dos bailes e eventos.', 'bg-gaucho-red text-white'],
  ['/minha-conta/inscricoes', 'Turmas presenciais', 'Inscrições nos cursos do grupo.', 'bg-white'],
  ['/minha-conta/pedidos', 'Meus pedidos', 'Compras, pagamentos e notas.', 'bg-white'],
  ['/minha-conta/dispositivos', 'Dispositivos', 'Aparelhos conectados às aulas.', 'bg-white'],
  ['/minha-conta/perfil', 'Meus dados', 'Cadastro usado na nota fiscal.', 'bg-white']
] as const;

export default function AccountPage() {
  return <AccountShell title="Minha conta"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([href, title, text, tone]) => <Link key={href} href={href} className={`group rounded-2xl p-6 shadow-lg ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl ${tone}`}><b className="font-display text-xl">{title}</b><p className="mt-2 text-sm opacity-70">{text}</p><span className="mt-4 inline-block font-label text-sm font-bold uppercase tracking-wider opacity-80 transition group-hover:translate-x-1">Abrir →</span></Link>)}</div></AccountShell>;
}

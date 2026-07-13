'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from './Header';
import { useAuth } from './providers/AuthProvider';

export function AccountShell({ children, title }: { children: React.ReactNode; title: string }) {
  const { user, loading, signOut } = useAuth(); const router = useRouter();
  useEffect(() => { if (!loading && !user) router.replace(`/login?returnTo=${encodeURIComponent(location.pathname)}`); }, [loading, user, router]);
  if (loading || !user) return <main className="min-h-screen bg-gaucho-cream"><Header /><div className="mx-auto max-w-6xl px-6 pt-40"><div className="h-64 animate-pulse rounded-xl bg-black/10" /></div></main>;
  const links = [['Visão geral', '/minha-conta'], ['Meus dados', '/minha-conta/perfil'], ['Meus pedidos', '/minha-conta/pedidos'], ['Meus ingressos', '/minha-conta/ingressos'], ['Minhas inscrições', '/minha-conta/inscricoes']];
  return <main className="min-h-screen bg-gaucho-cream text-black"><Header /><section className="mx-auto max-w-6xl px-6 pb-24 pt-36"><div className="grid gap-6 md:grid-cols-[230px_1fr]"><aside className="h-fit rounded-xl bg-[#07130d] p-5 text-white"><p className="mb-5 font-black text-gaucho-gold">{user.name}</p><nav className="grid gap-1">{links.map(([label, href]) => <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm hover:bg-white/10">{label}</Link>)}</nav><button onClick={async () => { await signOut(); router.push('/'); }} className="mt-6 px-3 text-sm text-white/60">Sair</button></aside><div><h1 className="mb-7 font-display text-4xl font-black md:text-5xl">{title}</h1>{children}</div></div></section></main>;
}

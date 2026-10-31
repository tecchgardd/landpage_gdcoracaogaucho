'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '../layout/Header';
import { useAuth } from '../providers/AuthProvider';

export function AccountShell({ children, title }: { children: React.ReactNode; title: string }) {
  const { user, loading } = useAuth(); const router = useRouter();
  useEffect(() => { if (!loading && !user) router.replace(`/login?returnTo=${encodeURIComponent(location.pathname)}`); }, [loading, user, router]);
  if (loading || !user) return <main className="min-h-screen bg-gaucho-cream"><Header /><div className="mx-auto max-w-6xl px-6 pt-40"><div className="h-64 animate-pulse rounded-xl bg-black/10" /></div></main>;
  return <main className="min-h-screen bg-gaucho-paper text-black"><Header /><section className="mx-auto max-w-6xl px-6 pb-24 pt-36"><h1 className="mb-7 font-display text-4xl font-black md:text-5xl">{title}</h1>{children}</section></main>;
}

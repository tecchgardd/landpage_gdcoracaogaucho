'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/components/providers/AuthProvider';

export default function SignupPage() {
  const { signUp } = useAuth(); const router = useRouter(); const params = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' }); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const requestedReturn = params?.get('returnTo');
  const returnTo = requestedReturn?.startsWith('/') ? requestedReturn : '/minha-conta';
  const submit = async (event: React.FormEvent) => { event.preventDefault(); if (form.password !== form.confirm) return setError('As senhas não coincidem.'); setLoading(true); setError(''); try { await signUp(form.name, form.email, form.password, form.phone); router.replace(returnTo); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Não foi possível criar a conta.'); } finally { setLoading(false); } };
  return <main className="min-h-screen bg-gaucho-cream"><Header /><section className="mx-auto max-w-lg px-6 pb-24 pt-36"><form onSubmit={submit} className="rounded-2xl bg-white p-8 text-black shadow-xl"><h1 className="font-display text-4xl font-black">Criar conta</h1><p className="mt-2 text-sm text-black/60">Cadastro rápido para compras e inscrições.</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><input required placeholder="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border p-3 sm:col-span-2" /><input required type="email" placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg border p-3" /><input required placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-lg border p-3" /><input required minLength={8} type="password" placeholder="Senha" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-lg border p-3" /><input required minLength={8} type="password" placeholder="Confirmar senha" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="rounded-lg border p-3" /></div>{error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="mt-6 w-full rounded-lg bg-gaucho-red py-4 font-black uppercase text-white disabled:opacity-50">{loading ? 'Criando…' : 'Criar conta'}</button></form></section></main>;
}

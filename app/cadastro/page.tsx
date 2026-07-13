'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/components/providers/AuthProvider';

const onlyDigits = (value: string) => value.replace(/\D/g, '');
const formatCpf = (value: string) => onlyDigits(value).slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const formatCep = (value: string) => onlyDigits(value).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
const isValidCpf = (formatted: string) => {
  const value = onlyDigits(formatted);
  if (!/^\d{11}$/.test(value) || /^(\d)\1{10}$/.test(value)) return false;
  const digit = (length: number) => {
    const sum = value.slice(0, length).split('').reduce((total, number, index) => total + Number(number) * (length + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };
  return digit(9) === Number(value[9]) && digit(10) === Number(value[10]);
};

export default function SignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', cpf: '', cep: '', address: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const requestedReturn = params?.get('returnTo');
  const returnTo = requestedReturn?.startsWith('/') ? requestedReturn : '/minha-conta';

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.name.trim().split(/\s+/).length < 2) return setError('Informe seu nome completo.');
    if (!isValidCpf(form.cpf)) return setError('Informe um CPF válido.');
    if (onlyDigits(form.cep).length !== 8) return setError('Informe um CEP válido.');
    if (form.password !== form.confirm) return setError('As senhas não coincidem.');
    setLoading(true);
    setError('');
    try {
      await signUp({ name: form.name.trim(), email: form.email.trim(), cpf: onlyDigits(form.cpf), cep: onlyDigits(form.cep), address: form.address.trim(), password: form.password });
      router.replace(returnTo);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível criar a conta.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'rounded-lg border border-black/20 p-3 outline-none transition focus:border-gaucho-green focus:ring-2 focus:ring-gaucho-green/15';

  return (
    <main className="min-h-screen bg-gaucho-cream">
      <Header />
      <section className="mx-auto max-w-2xl px-6 pb-24 pt-36">
        <form onSubmit={submit} className="rounded-2xl bg-white p-8 text-black shadow-xl">
          <h1 className="font-display text-4xl font-black">Criar conta</h1>
          <p className="mt-2 text-sm text-black/60">Informe os dados principais agora. Telefone e cidade poderão ser completados em “Meus dados”.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-bold sm:col-span-2">Nome completo<input required autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass} /></label>
            <label className="grid gap-1.5 text-sm font-bold">CPF<input required inputMode="numeric" autoComplete="off" placeholder="000.000.000-00" value={form.cpf} onChange={(event) => setForm({ ...form, cpf: formatCpf(event.target.value) })} className={inputClass} /></label>
            <label className="grid gap-1.5 text-sm font-bold">E-mail<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={inputClass} /></label>
            <label className="grid gap-1.5 text-sm font-bold">CEP<input required inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" value={form.cep} onChange={(event) => setForm({ ...form, cep: formatCep(event.target.value) })} className={inputClass} /></label>
            <label className="grid gap-1.5 text-sm font-bold sm:col-span-2">Endereço completo<input required autoComplete="street-address" placeholder="Rua, número, bairro e complemento" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} className={inputClass} /></label>
            <label className="grid gap-1.5 text-sm font-bold">Senha<input required minLength={8} type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className={inputClass} /><span className="text-xs font-normal text-black/50">Mínimo de 8 caracteres</span></label>
            <label className="grid gap-1.5 text-sm font-bold">Confirmar senha<input required minLength={8} type="password" autoComplete="new-password" value={form.confirm} onChange={(event) => setForm({ ...form, confirm: event.target.value })} className={inputClass} /></label>
          </div>
          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="mt-6 w-full rounded-lg bg-gaucho-red py-4 font-black uppercase text-white disabled:opacity-50">{loading ? 'Criando…' : 'Criar conta'}</button>
        </form>
      </section>
    </main>
  );
}

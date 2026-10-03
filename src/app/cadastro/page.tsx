'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/components/providers/AuthProvider';
import { PulseHeart } from '@/components/ui/PulseHeart';
import { MotionDiv } from '@/components/ui/Motion';
import { FlagWave } from '@/components/ui/FlagWave';
import { findAddressByCep } from '@/services/account/cepService';
import { isValidCpf, isValidEmail, isValidPhone, onlyDigits } from '@/utils/validators';

const formatCpf = (value: string) => onlyDigits(value).slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const formatCep = (value: string) => onlyDigits(value).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

export default function SignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', cpf: '', phone: '', cep: '', address: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cepStatus, setCepStatus] = useState<{ loading: boolean; message: string; error: boolean }>({ loading: false, message: '', error: false });
  const requestedReturn = params?.get('returnTo');
  const returnTo = requestedReturn?.startsWith('/') ? requestedReturn : '/minha-conta';

  useEffect(() => {
    const cep = onlyDigits(form.cep);
    if (cep.length !== 8) { setCepStatus({ loading: false, message: '', error: false }); return; }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setCepStatus({ loading: true, message: 'Verificando CEP…', error: false });
      findAddressByCep(cep, controller.signal)
        .then(() => setCepStatus({ loading: false, message: 'CEP encontrado.', error: false }))
        .catch((caught) => {
          if (caught instanceof DOMException && caught.name === 'AbortError') return;
          setCepStatus({ loading: false, message: caught instanceof Error ? caught.message : 'Não foi possível verificar o CEP.', error: true });
        });
    }, 350);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [form.cep]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.name.trim().split(/\s+/).length < 2) return setError('Informe seu nome completo.');
    if (!isValidCpf(form.cpf)) return setError('Informe um CPF válido.');
    if (!isValidPhone(form.phone)) return setError('Informe um telefone válido com DDD (ex: (48) 99221-0952).');
    if (!isValidEmail(form.email)) return setError('Informe um e-mail válido.');
    if (onlyDigits(form.cep).length !== 8) return setError('Informe um CEP válido.');
    if (cepStatus.error) return setError('Não encontramos esse CEP. Confira o número informado.');
    if (cepStatus.loading) return setError('Aguarde a verificação do CEP terminar.');
    if (form.password !== form.confirm) return setError('As senhas não coincidem.');
    setLoading(true);
    setError('');
    try {
      await signUp({ name: form.name.trim(), email: form.email.trim(), cpf: onlyDigits(form.cpf), phone: onlyDigits(form.phone), cep: onlyDigits(form.cep), address: form.address.trim(), password: form.password });
      router.replace(returnTo);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível criar a conta.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'rounded-lg border border-white/15 bg-white/5 p-3 text-white placeholder:text-white/35 outline-none transition focus:border-gaucho-gold focus:ring-2 focus:ring-gaucho-gold/20';

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07130d] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(207,22,22,.22),transparent_45%),radial-gradient(circle_at_85%_90%,rgba(0,91,37,.28),transparent_45%)]" />
      <Header />
      <section className="relative mx-auto max-w-2xl px-6 pb-24 pt-36">
        <MotionDiv className="flex flex-col items-center">
          <PulseHeart className="mb-5" />
          <form onSubmit={submit} className="auth-card w-full rounded-2xl border border-white/10 bg-[#0b100d]/90 p-8 shadow-[0_30px_80px_rgba(0,0,0,.6)] backdrop-blur">
            <h1 className="text-center font-display text-4xl font-black">Criar conta</h1>
            <p className="mt-2 text-center text-sm text-white/55">Informe os dados principais agora. Data de nascimento, gênero e os detalhes do endereço poderão ser completados em &ldquo;Meus dados&rdquo;.</p>
            <div className="mt-6 grid items-start gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-bold sm:col-span-2">Nome completo<input required autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass} /></label>
              <label className="grid gap-1.5 text-sm font-bold">CPF<input required inputMode="numeric" autoComplete="off" placeholder="000.000.000-00" value={form.cpf} onChange={(event) => setForm({ ...form, cpf: formatCpf(event.target.value) })} className={inputClass} /></label>
              <label className="grid gap-1.5 text-sm font-bold">Celular / WhatsApp<input required type="tel" inputMode="numeric" autoComplete="tel" placeholder="(00) 00000-0000" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={inputClass} /></label>
              <label className="grid gap-1.5 text-sm font-bold">E-mail<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={inputClass} /></label>
              <label className="grid gap-1.5 text-sm font-bold">CEP<input required inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" value={form.cep} onChange={(event) => setForm({ ...form, cep: formatCep(event.target.value) })} className={inputClass} />{cepStatus.message && <span className={`text-xs font-bold ${cepStatus.error ? 'text-red-400' : 'text-gaucho-gold'}`}>{cepStatus.loading ? '⌛ ' : cepStatus.error ? '⚠ ' : '✓ '}{cepStatus.message}</span>}</label>
              <label className="grid gap-1.5 text-sm font-bold sm:col-span-2">Endereço completo<input required autoComplete="street-address" placeholder="Rua, número, bairro e complemento" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} className={inputClass} /></label>
              <label className="grid gap-1.5 text-sm font-bold">Senha<input required minLength={8} type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className={inputClass} /><span className="text-xs font-normal text-white/45">Mínimo de 8 caracteres</span></label>
              <label className="grid gap-1.5 text-sm font-bold">Confirmar senha<input required minLength={8} type="password" autoComplete="new-password" value={form.confirm} onChange={(event) => setForm({ ...form, confirm: event.target.value })} className={inputClass} /></label>
            </div>
            {error && <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
            <button disabled={loading} className="btn-premium mt-6 w-full rounded-lg bg-gaucho-red py-4 font-black uppercase text-white shadow-lg shadow-red-950/30 transition-colors hover:bg-red-700 disabled:opacity-50">{loading ? 'Criando…' : 'Criar conta'}</button>
          </form>
        </MotionDiv>
      </section>
      <FlagWave />
    </main>
  );
}

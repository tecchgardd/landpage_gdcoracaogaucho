'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/components/providers/AuthProvider';
import { authService } from '@/services/account/authService';
import { PulseHeart } from '@/components/ui/PulseHeart';
import { MotionDiv } from '@/components/ui/Motion';
import { FlagWave } from '@/components/ui/FlagWave';

const inputClass = 'mt-2 w-full rounded-lg border border-white/15 bg-white/5 p-3 font-normal text-white placeholder:text-white/35 outline-none transition focus:border-gaucho-gold focus:ring-2 focus:ring-gaucho-gold/20';

export default function LoginPage() {
  const { signIn } = useAuth(); const router = useRouter(); const params = useSearchParams();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const requestedReturn = params?.get('returnTo');
  const returnTo = requestedReturn?.startsWith('/') ? requestedReturn : '/minha-conta';
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setLoading(true); setError(''); try { await signIn(email, password); router.replace(returnTo); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Não foi possível entrar.'); } finally { setLoading(false); } };
  const google = async () => { setError(''); try { await authService.signInGoogle(`${window.location.origin}${returnTo}`); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Login com Google indisponível.'); } };
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07130d] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(207,22,22,.22),transparent_45%),radial-gradient(circle_at_85%_90%,rgba(0,91,37,.28),transparent_45%)]" />
      <Header />
      <section className="relative mx-auto max-w-md px-6 pb-24 pt-36">
        <MotionDiv className="flex flex-col items-center">
          <PulseHeart className="mb-5" />
          <form onSubmit={submit} className="auth-card w-full rounded-2xl border border-white/10 bg-[#0b100d]/90 p-8 text-left shadow-[0_30px_80px_rgba(0,0,0,.6)] backdrop-blur">
            <h1 className="text-center font-display text-4xl font-black">Entre na sua conta</h1>
            <p className="mt-2 text-center text-sm text-white/55">Seu carrinho está salvo. Entre para continuar com segurança.</p>
            <button type="button" onClick={google} className="btn-premium mt-6 flex w-full items-center justify-center rounded-lg bg-white py-3 font-bold text-black transition-colors hover:bg-white/90"><FontAwesomeIcon icon={faGoogle} className="mr-3 text-lg" />Continuar com Google</button>
            <div className="my-5 flex items-center gap-3 text-xs text-white/35"><span className="h-px flex-1 bg-white/10" />ou entre com e-mail<span className="h-px flex-1 bg-white/10" /></div>
            <label className="block text-sm font-bold">E-mail<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></label>
            <label className="mt-4 block text-sm font-bold">Senha<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} /></label>
            {error && <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
            <button disabled={loading} className="btn-premium mt-6 w-full rounded-lg bg-gaucho-red py-4 font-black uppercase text-white shadow-lg shadow-red-950/30 transition-colors hover:bg-red-700 disabled:opacity-50">{loading ? 'Entrando…' : 'Entrar'}</button>
            <p className="mt-5 text-center text-sm text-white/70">Ainda não possui conta? <Link className="font-bold text-gaucho-gold transition-colors hover:text-yellow-300" href={`/cadastro?returnTo=${encodeURIComponent(returnTo)}`}>Criar conta</Link></p>
          </form>
        </MotionDiv>
      </section>
      <FlagWave />
    </main>
  );
}

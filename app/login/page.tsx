'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Header } from '@/components/Header';
import { useAuth } from '@/components/providers/AuthProvider';
import { authService } from '@/services/authService';

export default function LoginPage() {
  const { signIn } = useAuth(); const router = useRouter(); const params = useSearchParams();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const requestedReturn = params?.get('returnTo');
  const returnTo = requestedReturn?.startsWith('/') ? requestedReturn : '/minha-conta';
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setLoading(true); setError(''); try { await signIn(email, password); router.replace(returnTo); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Não foi possível entrar.'); } finally { setLoading(false); } };
  const google = async () => { setError(''); try { await authService.signInGoogle(`${window.location.origin}${returnTo}`); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Login com Google indisponível.'); } };
  return <main className="min-h-screen bg-gaucho-cream"><Header /><section className="mx-auto max-w-md px-6 pb-24 pt-36"><form onSubmit={submit} className="rounded-2xl bg-white p-8 text-black shadow-xl"><h1 className="font-display text-4xl font-black">Entre na sua conta</h1><p className="mt-2 text-sm text-black/60">Seu carrinho está salvo. Entre para continuar com segurança.</p><button type="button" onClick={google} className="mt-6 flex w-full items-center justify-center rounded-lg border border-black/15 py-3 font-bold hover:bg-black/5"><FontAwesomeIcon icon={faGoogle} className="mr-3 text-lg" />Continuar com Google</button><div className="my-5 flex items-center gap-3 text-xs text-black/40"><span className="h-px flex-1 bg-black/10" />ou entre com e-mail<span className="h-px flex-1 bg-black/10" /></div><label className="block text-sm font-bold">E-mail<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border p-3 font-normal" /></label><label className="mt-4 block text-sm font-bold">Senha<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-lg border p-3 font-normal" /></label>{error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="mt-6 w-full rounded-lg bg-gaucho-red py-4 font-black uppercase text-white disabled:opacity-50">{loading ? 'Entrando…' : 'Entrar'}</button><p className="mt-5 text-center text-sm">Ainda não possui conta? <Link className="font-bold text-gaucho-red" href={`/cadastro?returnTo=${encodeURIComponent(returnTo)}`}>Criar conta</Link></p></form></section></main>;
}

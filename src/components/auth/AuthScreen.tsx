'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faFacebookF, faGoogle, faMicrosoft, type IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/components/providers/AuthProvider';
import { SOCIAL_PROVIDER_NAMES, authService, type SocialProvider } from '@/services/account/authService';
import { findAddressByCep } from '@/services/account/cepService';
import { isValidCpf, isValidEmail, isValidPhone, onlyDigits } from '@/utils/validators';
import { GradientWaves } from './GradientWaves';

type Mode = 'login' | 'register';
const formatCpf = (value: string) => onlyDigits(value).slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const formatCep = (value: string) => onlyDigits(value).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
const message = (caught: unknown, fallback: string) => caught instanceof Error ? caught.message : fallback;
const inputClass = 'mt-1.5 w-full rounded-xl border border-gaucho-ink/15 bg-white px-3.5 py-2.5 font-normal text-gaucho-ink placeholder:text-gaucho-ink/35 outline-none transition focus:border-gaucho-green focus:ring-2 focus:ring-gaucho-green/20';
const labelClass = 'block text-xs font-bold uppercase tracking-wide text-gaucho-ink/70';
const fade = 'transition-all duration-[650ms] ease-in-out';
const shown = 'visible opacity-100 md:translate-x-0';
const ErrorBox = ({ text }: { text: string }) => text ? <p role="alert" className="mt-4 rounded-xl border border-gaucho-red/25 bg-gaucho-red/10 p-3 text-sm text-gaucho-red">{text}</p> : null;
const Submit = ({ loading, label, busy }: { loading: boolean; label: string; busy: string }) => <button disabled={loading} className="btn-premium mt-5 w-full rounded-xl bg-gaucho-red py-3.5 font-black uppercase text-white shadow-lg shadow-red-900/20 transition-colors hover:bg-red-700 disabled:opacity-50">{loading ? busy : label}</button>;
const SOCIAL: { provider: SocialProvider; icon: IconDefinition; color: string }[] = [{ provider: 'google', icon: faGoogle, color: 'text-[#ea4335]' }, { provider: 'apple', icon: faApple, color: 'text-black' }, { provider: 'facebook', icon: faFacebookF, color: 'text-[#1877f2]' }, { provider: 'microsoft', icon: faMicrosoft, color: 'text-[#00a4ef]' }];
const SocialLogin = ({ returnTo, label, onError }: { returnTo: string; label: string; onError: (text: string) => void }) => (
  <>
    <div className="mt-5 grid grid-cols-4 gap-2.5">{SOCIAL.map(({ provider, icon, color }) => <button key={provider} type="button" aria-label={`${label} com ${SOCIAL_PROVIDER_NAMES[provider]}`} title={SOCIAL_PROVIDER_NAMES[provider]} onClick={async () => { onError(''); try { await authService.signInSocial(provider, `${window.location.origin}${returnTo}`); } catch (caught) { onError(message(caught, `Login com ${SOCIAL_PROVIDER_NAMES[provider]} indisponível.`)); } }} className={`flex h-12 items-center justify-center rounded-xl border border-gaucho-ink/15 bg-white text-xl transition hover:-translate-y-0.5 hover:border-gaucho-ink/30 hover:shadow-md ${color}`}><FontAwesomeIcon icon={icon} /></button>)}</div>
    <div className="my-4 flex items-center gap-3 text-xs text-gaucho-ink/40"><span className="h-px flex-1 bg-gaucho-ink/10" />ou com e-mail<span className="h-px flex-1 bg-gaucho-ink/10" /></div>
  </>
);
const MobileSwitch = ({ text, label, onClick }: { text: string; label: string; onClick: () => void }) => <p className="mt-5 text-center text-sm text-gaucho-ink/70 md:hidden">{text} <button type="button" onClick={onClick} className="font-bold text-gaucho-green underline-offset-2 hover:underline">{label}</button></p>;

function LoginForm({ returnTo, onSwitch }: { returnTo: string; onSwitch: () => void }) {
  const { signIn } = useAuth(); const router = useRouter();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const enter = async (mail: string, pass: string, target: string) => { setLoading(true); setError(''); try { await signIn(mail, pass); router.replace(target); } catch (caught) { setError(message(caught, 'Não foi possível entrar.')); } finally { setLoading(false); } };
  return (
    <form onSubmit={(event) => { event.preventDefault(); enter(email, password, returnTo); }} className="my-auto w-full">
      <h2 className="font-display text-3xl font-black text-gaucho-ink">Entrar</h2>
      <p className="mt-1 text-sm text-gaucho-ink/60">Seu carrinho está salvo. Entre para continuar com segurança.</p>
      <SocialLogin returnTo={returnTo} label="Entrar" onError={setError} />
      <label className={labelClass}>E-mail<input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></label>
      <label className={`${labelClass} mt-3`}>Senha<input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} /></label>
      <ErrorBox text={error} />
      <Submit loading={loading} label="Entrar" busy="Entrando…" />
      <MobileSwitch text="Ainda não possui conta?" label="Criar conta" onClick={onSwitch} />
    </form>
  );
}

function RegisterForm({ returnTo, onSwitch }: { returnTo: string; onSwitch: () => void }) {
  const { signUp } = useAuth(); const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', cpf: '', phone: '', cep: '', address: '', password: '', confirm: '' });
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const [cepStatus, setCepStatus] = useState({ loading: false, message: '', error: false });
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  useEffect(() => {
    const cep = onlyDigits(form.cep);
    if (cep.length !== 8) { setCepStatus({ loading: false, message: '', error: false }); return; }
    const controller = new AbortController();
    const timer = setTimeout(() => { setCepStatus({ loading: true, message: 'Verificando CEP…', error: false }); findAddressByCep(cep, controller.signal).then(() => setCepStatus({ loading: false, message: 'CEP encontrado.', error: false })).catch((caught) => { if (caught instanceof DOMException && caught.name === 'AbortError') return; setCepStatus({ loading: false, message: message(caught, 'Não foi possível verificar o CEP.'), error: true }); }); }, 350);
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
    setLoading(true); setError('');
    try { await signUp({ name: form.name.trim(), email: form.email.trim(), cpf: onlyDigits(form.cpf), phone: onlyDigits(form.phone), cep: onlyDigits(form.cep), address: form.address.trim(), password: form.password }); router.replace(returnTo); }
    catch (caught) { setError(message(caught, 'Não foi possível criar a conta.')); }
    finally { setLoading(false); }
  };
  return (
    <form onSubmit={submit} className="my-auto w-full">
      <h2 className="font-display text-3xl font-black text-gaucho-ink">Criar conta</h2>
      <p className="mt-1 text-sm text-gaucho-ink/60">Nascimento, gênero e detalhes do endereço você completa depois em &ldquo;Meus dados&rdquo;.</p>
      <SocialLogin returnTo={returnTo} label="Criar conta" onError={setError} />
      <div className="grid items-start gap-3 sm:grid-cols-2">
        <label className={`${labelClass} sm:col-span-2`}>Nome completo<input required autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} /></label>
        <label className={labelClass}>CPF<input required inputMode="numeric" autoComplete="off" placeholder="000.000.000-00" value={form.cpf} onChange={(e) => set('cpf', formatCpf(e.target.value))} className={inputClass} /></label>
        <label className={labelClass}>Celular / WhatsApp<input required type="tel" inputMode="numeric" autoComplete="tel" placeholder="(00) 00000-0000" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} /></label>
        <label className={labelClass}>E-mail<input required type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} /></label>
        <label className={labelClass}>CEP<input required inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" value={form.cep} onChange={(e) => set('cep', formatCep(e.target.value))} className={inputClass} />{cepStatus.message && <span className={`mt-1 block normal-case tracking-normal ${cepStatus.error ? 'text-gaucho-red' : 'text-gaucho-green'}`}>{cepStatus.loading ? '⌛ ' : cepStatus.error ? '⚠ ' : '✓ '}{cepStatus.message}</span>}</label>
        <label className={`${labelClass} sm:col-span-2`}>Endereço<input required autoComplete="street-address" placeholder="Rua, número, bairro e complemento" value={form.address} onChange={(e) => set('address', e.target.value)} className={inputClass} /></label>
        <label className={labelClass}>Senha<input required minLength={8} type="password" autoComplete="new-password" placeholder="Mínimo de 8 caracteres" value={form.password} onChange={(e) => set('password', e.target.value)} className={inputClass} /></label>
        <label className={labelClass}>Confirmar senha<input required minLength={8} type="password" autoComplete="new-password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} className={inputClass} /></label>
      </div>
      <ErrorBox text={error} />
      <Submit loading={loading} label="Criar conta" busy="Criando…" />
      <p className="mt-3 text-center text-xs text-gaucho-ink/55">Ao criar a conta você concorda com os <a href="/termos" target="_blank" className="font-bold underline">Termos de Uso</a> e a <a href="/privacidade" target="_blank" className="font-bold underline">Política de Privacidade</a>.</p>
      <MobileSwitch text="Já tem conta?" label="Entrar" onClick={onSwitch} />
    </form>
  );
}

function Hero({ active, side, title, text, buttonLabel, onSwitch }: { active: boolean; side: 'left' | 'right'; title: string; text: string; buttonLabel: string; onSwitch: () => void }) {
  const hidden = side === 'right' ? 'invisible opacity-0 translate-x-full' : 'invisible opacity-0 -translate-x-full';
  return (
    <div aria-hidden={!active} className={`${fade} absolute top-0 z-[3] hidden h-full w-1/2 flex-col items-center justify-center gap-4 px-10 text-center text-gaucho-snow md:flex ${side === 'right' ? 'left-1/2' : 'left-0'} ${active ? shown : hidden}`}>
      <span className="font-script text-4xl text-gaucho-gold drop-shadow">Coração Gaúcho</span>
      <h2 className="font-display text-4xl font-black drop-shadow">{title}</h2>
      <p className="mb-1.5 max-w-xs leading-relaxed opacity-90">{text}</p>
      <button type="button" tabIndex={active ? 0 : -1} onClick={onSwitch} className="rounded-full bg-white/10 px-12 py-3 font-bold backdrop-blur transition duration-300 hover:bg-gaucho-snow hover:text-gaucho-ink">{buttonLabel}</button>
    </div>
  );
}

export function AuthScreen({ initialMode }: { initialMode: Mode }) {
  const params = useSearchParams();
  const [mode, setMode] = useState<Mode>(initialMode);
  const isRegister = mode === 'register';
  const requestedReturn = params?.get('returnTo');
  const returnTo = requestedReturn?.startsWith('/') ? requestedReturn : '/minha-conta';
  const switchTo = (next: Mode) => { setMode(next); window.history.replaceState(null, '', `${next === 'register' ? '/cadastro' : '/login'}${window.location.search}`); };
  return (
    <main className="relative min-h-screen overflow-hidden bg-gaucho-night">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0"><GradientWaves horizonColor="#173b27" waveColor="#06110b" crestColor="#2f6b45" amplitude={2.8} fogDepth={34} brightness={1.1} /></div>
      <Header />
      <section className="relative flex min-h-screen items-center justify-center px-4 pb-16 pt-32">
        <h1 className="sr-only">{isRegister ? 'Criar conta' : 'Entrar na sua conta'}</h1>
        <div className="relative z-[1] w-full max-w-[980px] overflow-hidden rounded-[32px] border-8 border-gaucho-snow bg-gaucho-snow shadow-[0_40px_100px_rgba(0,0,0,.55)] md:h-[660px]">
          <div aria-hidden="true" className={`${fade} absolute inset-y-0 left-0 z-[2] hidden w-1/2 overflow-hidden rounded-[26px] bg-gaucho-green md:block ${isRegister ? 'translate-x-0' : 'translate-x-full'}`}>
            <GradientWaves horizonColor="#0a5a2a" waveColor="#a8141b" crestColor="#f3c614" amplitude={3.2} fogDepth={22} brightness={0.9} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/40" />
          </div>
          <Hero active={isRegister} side="left" title="Que bom te ver!" text="Já tem conta? Entre para ver seus ingressos, pedidos e cursos online." buttonLabel="Entrar" onSwitch={() => switchTo('login')} />
          <Hero active={!isRegister} side="right" title="Primeira vez aqui?" text="Crie sua conta para comprar ingressos, se inscrever nas turmas e assistir às aulas." buttonLabel="Criar conta" onSwitch={() => switchTo('register')} />
          <div className={`${fade} flex flex-col px-6 py-8 sm:px-10 md:absolute md:left-0 md:top-0 md:h-full md:w-1/2 md:overflow-y-auto md:px-12 ${!isRegister ? shown : 'max-md:hidden md:invisible md:translate-x-full md:opacity-0'}`}>
            <LoginForm returnTo={returnTo} onSwitch={() => switchTo('register')} />
          </div>
          <div className={`${fade} flex flex-col px-6 py-8 sm:px-10 md:absolute md:left-1/2 md:top-0 md:h-full md:w-1/2 md:overflow-y-auto md:px-9 ${isRegister ? shown : 'max-md:hidden md:invisible md:-translate-x-full md:opacity-0'}`}>
            <RegisterForm returnTo={returnTo} onSwitch={() => switchTo('login')} />
          </div>
        </div>
      </section>
    </main>
  );
}

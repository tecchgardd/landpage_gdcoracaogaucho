'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCart } from '@/components/providers/CartProvider';
import { meService, type CartValidation, type CheckoutResult, type Profile } from '@/services/meService';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const emptyProfile = (user: { id: string; name?: string; email?: string }): Profile => ({
  userId: user.id, name: user.name ?? '', email: user.email ?? '', cpf: '', phone: '', birthDate: '', gender: '', cep: '', address: '',
  number: '', complement: '', neighborhood: '', state: '', city: '', complete: false
});

function hasCompleteProfile(profile: Profile | null) {
  return Boolean(profile?.name && profile.cpf && profile.phone && profile.birthDate && profile.gender && profile.cep && profile.address && profile.number && profile.neighborhood && profile.state && profile.city);
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.length > 10 ? digits.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3') : digits.replace(/^(\d{2})(\d{4})(\d{4}).*/, '($1) $2-$3');
}

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const cart = useCart();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [validation, setValidation] = useState<CartValidation | null>(null);
  const [profileError, setProfileError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [actionError, setActionError] = useState('');
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<CheckoutResult | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login?returnTo=/checkout');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    setProfile((current) => current ?? emptyProfile(user));
    if (!cart.items.length) { setLoading(false); return; }

    let active = true;
    setLoading(true); setProfileError(''); setValidationError(''); setValidation(null);
    Promise.allSettled([meService.profile(), meService.validateCart(cart.items)])
      .then(([profileResult, validationResult]) => {
        if (!active) return;
        if (profileResult.status === 'fulfilled') setProfile(profileResult.value);
        else setProfileError(profileResult.reason instanceof Error ? profileResult.reason.message : 'Não foi possível carregar seus dados salvos.');
        if (validationResult.status === 'fulfilled') setValidation(validationResult.value);
        else setValidationError(validationResult.reason instanceof Error ? validationResult.reason.message : 'Não foi possível validar os itens do carrinho.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user, cart.items]);

  const profileComplete = hasCompleteProfile(profile);
  const hasInvalidItems = Boolean(validation?.invalidItems.length);
  const canFinish = profileComplete && Boolean(validation?.validItems.length) && !hasInvalidItems && !loading;

  const finish = async () => {
    setActionError(''); setLoading(true);
    try {
      const checkout = await meService.checkout(cart.items);
      setResult(checkout); cart.clear();
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : 'Não foi possível concluir o pedido.');
    } finally { setLoading(false); }
  };

  if (authLoading || (!profile && loading)) return <main className="min-h-screen bg-gaucho-cream"><Header /><div className="mx-auto max-w-5xl px-5 pt-36"><div className="h-72 animate-pulse rounded-3xl bg-black/10" /></div></main>;
  if (!cart.items.length && !result) return <main className="min-h-screen bg-gaucho-cream"><Header /><section className="mx-auto max-w-3xl px-5 pb-20 pt-36 text-center"><span className="text-5xl">🛒</span><h1 className="mt-5 font-display text-4xl font-black">Seu carrinho está vazio</h1><p className="mt-2 text-black/55">Escolha um evento para iniciar seu pedido.</p><Link href="/bilheteria" className="mt-6 inline-block rounded-xl bg-gaucho-red px-6 py-3 font-black text-white">Explorar bilheteria</Link></section></main>;

  return (
    <main className="min-h-screen bg-gaucho-cream text-black">
      <Header />
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-6 sm:pt-36">
        <Link href="/carrinho" className="inline-flex items-center gap-2 text-sm font-bold text-black/55 transition hover:text-gaucho-green">← Voltar ao carrinho</Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[0.22em] text-gaucho-red">Finalização da compra</p><h1 className="mt-1 font-display text-4xl font-black sm:text-5xl">Checkout seguro</h1></div>
          {!result && <div className="hidden items-center gap-2 text-xs font-bold text-black/40 sm:flex"><StepDot active done={profileComplete}>1</StepDot><span>Dados</span><i className="h-px w-6 bg-black/15" /><StepDot active={Boolean(validation)}>2</StepDot><span>Itens</span><i className="h-px w-6 bg-black/15" /><StepDot>3</StepDot><span>Confirmar</span></div>}
        </div>

        {result ? (
          <div className="mt-8 rounded-3xl border border-green-200 bg-white p-8 text-center shadow-xl sm:p-12"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-gaucho-green">✓</span><h2 className="mt-5 text-3xl font-black">{result.free ? 'Pedido confirmado!' : 'Pedido criado'}</h2><p className="mt-2 text-black/55">Código do pedido: <b className="text-black">{result.orderCode}</b></p>{result.checkoutUrl && <a href={result.checkoutUrl} className="mt-6 inline-block rounded-xl bg-gaucho-red px-7 py-4 font-black text-white">Continuar para pagamento</a>}<Link href={`/minha-conta/pedidos/${result.orderId}`} className="mt-5 block font-bold text-gaucho-green">Acompanhar pedido →</Link></div>
        ) : (
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              <Card number="1" title="Dados do comprador" action={profileComplete ? <Link href="/minha-conta/perfil?returnTo=/checkout" className="text-sm font-bold text-gaucho-green">Editar dados</Link> : undefined}>
                {profileError ? <Alert tone="error">Não foi possível verificar seus dados: {profileError}</Alert> : profileComplete && profile ? <BuyerSummary profile={profile} /> : <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-5"><div><h3 className="font-black text-amber-950">Seu cadastro ainda está incompleto</h3><p className="mt-1 text-sm leading-6 text-amber-900/75">Preencha os dados pessoais e o endereço para liberar a confirmação.</p></div><Link href="/minha-conta/perfil?returnTo=/checkout" className="mt-4 inline-block shrink-0 rounded-xl bg-gaucho-green px-5 py-3 text-sm font-black text-white sm:mt-0">Completar dados</Link></div>}
              </Card>

              <Card number="2" title="Itens do pedido" subtitle={`${cart.count} ${cart.count === 1 ? 'item' : 'itens'} no carrinho`}>
                {validationError && <Alert tone="error">Não foi possível validar preços e disponibilidade: {validationError}</Alert>}
                {loading && !validation ? <div className="space-y-3"><div className="h-20 animate-pulse rounded-2xl bg-black/5" /><p className="text-center text-xs font-bold text-black/40">Validando disponibilidade e valores…</p></div> : validation ? <div className="space-y-3">
                  {validation.validItems.map((item) => <article key={item.eventId} className="flex flex-col gap-4 rounded-2xl border border-black/10 p-4 sm:flex-row sm:items-center sm:justify-between"><div><span className="rounded-full bg-gaucho-green/10 px-2.5 py-1 text-[10px] font-black text-gaucho-green">{item.type}</span><h3 className="mt-2 font-black">{item.name}</h3><p className="mt-1 text-sm text-black/50">{item.quantity} × {money.format(item.unitPrice)}</p>{item.quantityAdjusted && <p className="mt-1 text-xs font-bold text-amber-700">Quantidade ajustada à disponibilidade.</p>}</div><b className="text-lg">{money.format(item.total)}</b></article>)}
                  {validation.invalidItems.map((item) => <article key={item.eventId} className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4"><div><span className="text-[10px] font-black uppercase tracking-wider text-red-600">Indisponível</span><h3 className="mt-1 font-black text-red-900">{item.name ?? 'Item do carrinho'}</h3><p className="mt-1 text-sm text-red-700">{item.reason}</p></div><button onClick={() => cart.remove(item.eventId)} className="mt-3 text-sm font-black text-red-700 underline underline-offset-4 sm:mt-0">Remover item</button></article>)}
                </div> : null}
              </Card>
            </div>

            <aside className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(40,30,15,0.12)] lg:sticky lg:top-6">
              <h2 className="text-xl font-black">Resumo do pedido</h2>
              <div className="mt-6 space-y-3 text-sm"><p className="flex justify-between gap-4"><span className="text-black/55">Subtotal</span><b>{money.format(validation?.subtotal ?? 0)}</b></p><p className="flex justify-between gap-4"><span className="text-black/55">Taxa</span><b>{money.format(validation?.fee ?? 0)}</b></p></div>
              <p className="mt-5 flex items-end justify-between gap-4 border-t pt-5"><span className="font-bold">Total</span><b className="text-2xl">{money.format(validation?.total ?? 0)}</b></p>
              {actionError && <div className="mt-4"><Alert tone="error">{actionError}</Alert></div>}
              <button disabled={!canFinish} onClick={finish} className="mt-6 w-full rounded-xl bg-gaucho-red py-4 font-black uppercase tracking-wide text-white shadow-lg shadow-red-950/15 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:shadow-none disabled:grayscale disabled:opacity-40">{loading ? 'Validando…' : 'Confirmar pedido'}</button>
              <CheckoutHint loading={loading} validation={validation} profileComplete={profileComplete} />
              <p className="mt-5 flex items-center justify-center gap-2 border-t pt-4 text-xs text-black/40"><span>🔒</span> Ambiente seguro para sua compra</p>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

function StepDot({ children, active = false, done = false }: { children: React.ReactNode; active?: boolean; done?: boolean }) { return <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${done ? 'bg-gaucho-green text-white' : active ? 'bg-gaucho-gold text-black' : 'bg-black/10'}`}>{done ? '✓' : children}</span>; }
function Card({ number, title, subtitle, action, children }: { number: string; title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) { return <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-[0_12px_35px_rgba(40,30,15,0.08)] sm:p-7"><header className="mb-5 flex items-start justify-between gap-4"><div className="flex items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gaucho-gold/20 text-xs font-black text-gaucho-green">{number}</span><div><h2 className="text-xl font-black">{title}</h2>{subtitle && <p className="mt-0.5 text-xs text-black/45">{subtitle}</p>}</div></div>{action}</header>{children}</section>; }
function Alert({ children, tone }: { children: React.ReactNode; tone: 'error' }) { return <p className={tone === 'error' ? 'rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700' : ''}>{children}</p>; }
function BuyerSummary({ profile }: { profile: Profile }) { const firstLine = [profile.address, profile.number].filter(Boolean).join(', '); const city = [profile.city, profile.state].filter(Boolean).join('/'); const secondLine = [profile.neighborhood, city].filter(Boolean).join(' • '); return <div className="grid gap-4 sm:grid-cols-2"><Info label="Contato" value={profile.name} detail={`${profile.email} • ${formatPhone(profile.phone)}`} /><Info label="Entrega / cadastro" value={firstLine} detail={secondLine} /></div>; }
function Info({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="rounded-2xl bg-black/[0.035] p-4"><span className="text-[10px] font-black uppercase tracking-wider text-black/40">{label}</span><p className="mt-1 font-black">{value}</p><p className="mt-1 break-words text-sm text-black/50">{detail}</p></div>; }
function CheckoutHint({ loading, validation, profileComplete }: { loading: boolean; validation: CartValidation | null; profileComplete: boolean }) { let text = ''; if (loading) text = 'Aguarde a validação dos itens.'; else if (!profileComplete) text = 'Complete seus dados para continuar.'; else if (!validation) text = 'Não foi possível validar o carrinho.'; else if (validation.invalidItems.length) text = 'Remova os itens indisponíveis para continuar.'; else if (!validation.validItems.length) text = 'Seu carrinho não possui itens válidos.'; return text ? <p className="mt-3 text-center text-xs font-bold leading-5 text-black/45">{text}</p> : null; }

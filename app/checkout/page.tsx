'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCart } from '@/components/providers/CartProvider';
import { meService, type CartValidation, type CheckoutResult, type Profile } from '@/services/meService';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

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
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<CheckoutResult | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login?returnTo=/checkout');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    // Render the form immediately from the authenticated account. API profile
    // data replaces it when available, but one failed request never hides it.
    setProfile((current) => current ?? {
      userId: user.id,
      name: user.name ?? '',
      email: user.email ?? '',
      cpf: '',
      phone: '',
      address: '',
      city: '',
      complete: false
    });

    if (!cart.items.length) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setProfileError('');
    setValidationError('');

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

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setActionError('');
    try {
      const saved = await meService.updateProfile(profile);
      setProfile({ ...profile, ...saved, complete: true });
      setProfileError('');
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : 'Não foi possível salvar seus dados.');
    } finally {
      setSaving(false);
    }
  };

  const finish = async () => {
    setActionError('');
    setLoading(true);
    try {
      const checkout = await meService.checkout(cart.items);
      setResult(checkout);
      cart.clear();
    } catch (caught) {
      setActionError(caught instanceof Error ? caught.message : 'Não foi possível concluir o pedido.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (!profile && loading)) {
    return <main className="min-h-screen bg-gaucho-cream"><Header /><div className="mx-auto max-w-4xl px-6 pt-40"><div className="h-64 animate-pulse rounded-2xl bg-black/10" /></div></main>;
  }

  if (!cart.items.length && !result) {
    return <main className="min-h-screen bg-gaucho-cream"><Header /><section className="mx-auto max-w-3xl px-6 pt-40 text-center"><h1 className="text-3xl font-black">Seu carrinho está vazio</h1><Link href="/bilheteria" className="mt-5 inline-block text-gaucho-red">Voltar à bilheteria</Link></section></main>;
  }

  return (
    <main className="min-h-screen bg-gaucho-cream text-black">
      <Header />
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-36">
        <h1 className="font-display text-5xl font-black">Checkout seguro</h1>
        {result ? (
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-black">{result.free ? 'Pedido confirmado!' : 'Pedido criado'}</h2>
            <p className="mt-2">Código: <b>{result.orderCode}</b></p>
            {result.checkoutUrl && <a href={result.checkoutUrl} className="mt-5 inline-block rounded-lg bg-gaucho-red px-7 py-4 font-black text-white">Continuar para pagamento</a>}
            <Link href={`/minha-conta/pedidos/${result.orderId}`} className="mt-5 block font-bold text-gaucho-green">Acompanhar pedido</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              {profile && (
                <section className="rounded-2xl bg-white p-6 shadow-lg">
                  <h2 className="text-xl font-black">Dados do comprador</h2>
                  <p className="mt-1 text-sm text-black/55">Confira os dados que serão usados no pedido. O e-mail da conta não pode ser alterado aqui.</p>
                  {profileError && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Seus dados salvos não puderam ser carregados ({profileError}). Preencha os campos abaixo e salve para continuar.</p>}
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="Nome completo" value={profile.name} onChange={(value) => setProfile({ ...profile, name: value, complete: false })} autoComplete="name" />
                    <Field label="E-mail" value={profile.email} disabled autoComplete="email" />
                    <Field label="CPF" value={profile.cpf} onChange={(value) => setProfile({ ...profile, cpf: value, complete: false })} autoComplete="off" />
                    <Field label="Telefone" value={profile.phone} onChange={(value) => setProfile({ ...profile, phone: value, complete: false })} autoComplete="tel" />
                    <Field label="Endereço" value={profile.address} onChange={(value) => setProfile({ ...profile, address: value, complete: false })} autoComplete="street-address" />
                    <Field label="Cidade" value={profile.city} onChange={(value) => setProfile({ ...profile, city: value, complete: false })} autoComplete="address-level2" />
                  </div>
                  <button onClick={saveProfile} disabled={saving} className="mt-5 rounded-lg border border-gaucho-green px-5 py-3 font-bold text-gaucho-green disabled:opacity-50">{saving ? 'Salvando…' : 'Salvar dados'}</button>
                  {!profile.complete && <p className="mt-3 text-sm font-bold text-gaucho-red">Salve seus dados antes de confirmar o pedido.</p>}
                </section>
              )}

              <section className="rounded-2xl bg-white p-6 shadow-lg">
                <h2 className="text-xl font-black">Itens do pedido</h2>
                {validationError && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Não foi possível validar preços e disponibilidade: {validationError}</p>}
                {validation ? (
                  <>
                    {validation.validItems.map((item) => <div key={item.eventId} className="mt-4 flex justify-between gap-4 border-t pt-4"><div><b>{item.name}</b><p className="text-sm text-black/55">{item.quantity} × {money.format(item.unitPrice)}</p>{item.quantityAdjusted && <p className="text-sm text-gaucho-red">Quantidade ajustada à disponibilidade atual.</p>}</div><b>{money.format(item.total)}</b></div>)}
                    {validation.invalidItems.map((item) => <p key={item.eventId} className="mt-3 rounded bg-red-50 p-3 text-red-700">{item.name ?? 'Item'}: {item.reason}</p>)}
                  </>
                ) : (
                  cart.items.map((item) => <div key={item.eventId} className="mt-4 flex justify-between gap-4 border-t pt-4"><div><b>{item.snapshot.title}</b><p className="text-sm text-black/55">Quantidade: {item.quantity}</p></div><span className="text-sm font-bold text-black/50">Aguardando validação</span></div>)
                )}
              </section>
            </div>

            <aside className="h-fit rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-black">Resumo do pedido</h2>
              <p className="mt-5 flex justify-between"><span>Subtotal</span><b>{money.format(validation?.subtotal ?? 0)}</b></p>
              <p className="mt-2 flex justify-between"><span>Taxa</span><b>{money.format(validation?.fee ?? 0)}</b></p>
              <p className="mt-4 flex justify-between border-t pt-4 text-xl"><span>Total</span><b>{money.format(validation?.total ?? 0)}</b></p>
              {actionError && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{actionError}</p>}
              <button disabled={loading || !profile?.complete || !validation || Boolean(validation.invalidItems.length) || validation.validItems.length === 0} onClick={finish} className="mt-6 w-full rounded-lg bg-gaucho-red py-4 font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-40">{loading ? 'Validando…' : 'Confirmar pedido'}</button>
              {!validation && <p className="mt-3 text-center text-xs text-black/50">O pedido será liberado assim que preços e disponibilidade forem validados.</p>}
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

function Field({ label, value, onChange, disabled = false, autoComplete }: { label: string; value: string; onChange?: (value: string) => void; disabled?: boolean; autoComplete: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-bold text-black/70">
      {label}
      <input value={value} onChange={(event) => onChange?.(event.target.value)} disabled={disabled} autoComplete={autoComplete} className="rounded-lg border border-black/20 bg-white p-3 font-normal text-black outline-none transition focus:border-gaucho-green focus:ring-2 focus:ring-gaucho-green/15 disabled:bg-black/5 disabled:text-black/50" />
    </label>
  );
}

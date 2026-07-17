'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Header } from './Header';
import { meService, type PaymentStatus } from '@/services/meService';
import { forgetCheckoutOrder, recoverCheckoutOrder } from '@/services/checkoutRecovery';

const WAITING = new Set(['PENDENTE', 'PROCESSANDO']);
const RETRYABLE = new Set(['FALHOU', 'CANCELADO', 'EXPIRADO']);
const COPY: Record<string, [string, string]> = {
  PAGO: ['Pagamento confirmado!', 'Seu pagamento foi confirmado e seus ingressos estão disponíveis.'],
  FALHOU: ['Pagamento não aprovado', 'A cobrança não foi concluída. Você pode tentar novamente.'],
  CANCELADO: ['Pagamento cancelado', 'O pagamento não foi concluído e o pedido não foi alterado localmente.'],
  EXPIRADO: ['Sessão expirada', 'O prazo desta tentativa terminou. Inicie uma nova tentativa.'],
  ESTORNADO: ['Pagamento reembolsado', 'O valor deste pagamento foi reembolsado integralmente.'],
  PARCIALMENTE_ESTORNADO: ['Reembolso parcial', 'Parte do valor deste pagamento foi reembolsada.'],
  CONTESTADO: ['Pagamento em análise', 'A contestação está em análise. Acompanhe o pedido para novas informações.'],
  CONTESTACAO_PERDIDA: ['Atualização financeira', 'Entre em contato com o atendimento para entender a situação deste pagamento.']
};

export function CheckoutStatusPage() {
  const [orderId, setOrderId] = useState<number | null>(null);
  const [payment, setPayment] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState('');
  const [timedOut, setTimedOut] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const running = useRef(false);

  useEffect(() => { setOrderId(recoverCheckoutOrder()); }, []);
  useEffect(() => {
    if (!orderId) return;
    let active = true; let timer: ReturnType<typeof setTimeout>; let attempts = 0;
    const poll = async () => {
      try {
        const next = await meService.paymentStatus(orderId);
        if (!active) return;
        setPayment(next); attempts += 1;
        if (next.paymentStatus === 'PAGO') forgetCheckoutOrder();
        else if (WAITING.has(next.paymentStatus) && attempts < 15) timer = setTimeout(poll, 2000);
        else if (WAITING.has(next.paymentStatus)) setTimedOut(true);
      } catch (caught) { if (active) setError(caught instanceof Error ? caught.message : 'Não foi possível consultar o pagamento.'); }
    };
    void poll();
    return () => { active = false; clearTimeout(timer); };
  }, [orderId]);

  const retry = async () => {
    if (!orderId || running.current) return;
    running.current = true; setRetrying(true); setError('');
    try { const result = await meService.retryPayment(orderId); if (result.checkoutUrl) window.location.assign(result.checkoutUrl); else setError('Não foi possível abrir uma nova sessão de pagamento.'); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Não foi possível tentar novamente.'); }
    finally { running.current = false; setRetrying(false); }
  };

  const status = payment?.paymentStatus;
  const [title, description] = status && COPY[status] ? COPY[status] : timedOut ? ['A confirmação está demorando', 'Acompanhe seu pedido. A confirmação continuará sendo processada pelo servidor.'] : ['Confirmando pagamento…', 'A confirmação pode levar alguns segundos. Não feche esta página.'];
  return <main className="min-h-screen bg-gaucho-cream text-black"><Header /><section aria-live="polite" className="mx-auto max-w-2xl px-5 pb-24 pt-36 text-center"><div className="rounded-3xl border border-black/5 bg-white p-8 shadow-xl sm:p-12"><span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl ${status === 'PAGO' ? 'bg-green-100 text-gaucho-green' : WAITING.has(status ?? '') && !timedOut ? 'animate-pulse bg-gaucho-gold/20' : 'bg-amber-100 text-amber-800'}`}>{status === 'PAGO' ? '✓' : WAITING.has(status ?? '') && !timedOut ? '…' : '!'}</span><h1 className="mt-6 font-display text-4xl font-black">{orderId ? title : 'Pedido não encontrado'}</h1><p className="mt-3 text-black/55">{orderId ? description : 'Acesse seus pedidos para acompanhar ou retomar o pagamento.'}</p>{error && <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}{status === 'PAGO' && <Link href="/minha-conta/ingressos" className="mt-7 inline-block rounded-xl bg-gaucho-green px-6 py-3 font-black text-white">Ver meus ingressos</Link>}{status && RETRYABLE.has(status) && <button onClick={retry} disabled={retrying} className="mt-7 w-full rounded-xl bg-gaucho-red px-6 py-4 font-black text-white disabled:opacity-50">{retrying ? 'Abrindo pagamento…' : 'Tentar novamente'}</button>}{orderId && <Link href={`/minha-conta/pedidos/${orderId}`} className="mt-5 block font-bold text-gaucho-green">Ver meu pedido</Link>}<Link href="/bilheteria" className="mt-4 block text-sm font-bold text-black/50">Voltar à bilheteria</Link></div></section></main>;
}

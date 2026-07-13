'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { meService, type CustomerOrder } from '@/services/meService';
import { TicketQrCode } from './TicketQrCode';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

type Loadable<T> = { data: T | null; error: string };

export function OrdersList() {
  const [state, setState] = useState<Loadable<CustomerOrder[]>>({ data: null, error: '' });

  useEffect(() => {
    meService.orders()
      .then((response) => setState({ data: response.data, error: '' }))
      .catch((error) => setState({ data: [], error: error instanceof Error ? error.message : 'Não foi possível carregar seus pedidos.' }));
  }, []);

  if (!state.data) return <Loading />;
  if (state.error) return <ErrorState title="Não foi possível carregar seus pedidos" message={state.error} />;
  if (!state.data.length) return <Empty title="Você ainda não realizou nenhuma compra" text="Quando você finalizar uma compra, o pedido e o pagamento aparecerão aqui." />;

  return (
    <div className="space-y-4">
      {state.data.map((order) => (
        <Link key={order.id} href={`/minha-conta/pedidos/${order.id}`} className="block rounded-xl border border-black/5 bg-white p-5 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-gaucho-red">Pedido</span>
              <h2 className="mt-1 text-xl font-black">{order.code}</h2>
              <p className="mt-1 text-sm text-black/55">Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full bg-gaucho-gold/20 px-3 py-1 text-xs font-black text-gaucho-green">{order.statusLabel}</span>
              <strong className="mt-2 block text-xl">{money.format(Number(order.total))}</strong>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm">
            <span className="text-black/55">{order.items?.length ?? 0} {(order.items?.length ?? 0) === 1 ? 'item' : 'itens'}</span>
            <b className="text-gaucho-green">Ver detalhes →</b>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function TicketsList() {
  const [state, setState] = useState<Loadable<Array<Record<string, unknown>>>>({ data: null, error: '' });

  useEffect(() => {
    meService.tickets()
      .then((response) => setState({ data: response.data, error: '' }))
      .catch((error) => setState({ data: [], error: error instanceof Error ? error.message : 'Não foi possível carregar seus ingressos.' }));
  }, []);

  if (!state.data) return <Loading />;
  if (state.error) return <ErrorState title="Não foi possível carregar seus ingressos" message={state.error} />;
  if (!state.data.length) return <Empty title="Você ainda não possui ingressos" text="Ingressos pagos e válidos aparecerão aqui com o QR Code para acesso ao evento." />;
  return <Cards data={state.data} kind="ticket" />;
}

export function EnrollmentsList() {
  const [state, setState] = useState<Loadable<Array<Record<string, unknown>>>>({ data: null, error: '' });

  useEffect(() => {
    meService.enrollments()
      .then((response) => setState({ data: response.data, error: '' }))
      .catch((error) => setState({ data: [], error: error instanceof Error ? error.message : 'Não foi possível carregar suas inscrições.' }));
  }, []);

  if (!state.data) return <Loading />;
  if (state.error) return <ErrorState title="Não foi possível carregar suas inscrições" message={state.error} />;
  if (!state.data.length) return <Empty title="Você ainda não possui inscrições" text="Suas inscrições confirmadas em cursos aparecerão aqui." />;
  return <Cards data={state.data} kind="enrollment" />;
}

function Cards({ data, kind }: { data: Array<Record<string, unknown>>; kind: 'ticket' | 'enrollment' }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.map((item) => {
        const event = item.evento as Record<string, unknown> | undefined;
        return (
          <article key={String(item.id)} className="rounded-xl border border-black/5 bg-white p-5 shadow-lg">
            <span className="text-xs font-black text-gaucho-red">{kind === 'ticket' ? 'INGRESSO' : 'INSCRIÇÃO'}</span>
            <h2 className="mt-2 text-xl font-black">{String(event?.nome ?? 'Coração Gaúcho')}</h2>
            <p className="mt-2 text-sm text-black/55">{[event?.local, event?.cidade].filter(Boolean).map(String).join(' • ')}</p>
            <span className="mt-4 inline-block rounded-full bg-gaucho-gold/20 px-3 py-1 text-xs font-black text-gaucho-green">{String(item.statusLabel ?? item.status)}</span>
            {kind === 'ticket' && (
              <div className="mt-4 rounded-xl border border-dashed border-black/15 p-3 text-center">
                <TicketQrCode value={String(item.qrcode ?? item.id)} />
                <p className="mt-2 break-all text-xs text-black/55">Código: {String(item.qrcode ?? item.id)}</p>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function Loading() {
  return <div className="h-48 animate-pulse rounded-xl bg-black/10" />;
}

function Empty({ title, text }: { title: string; text: string }) {
  return <div className="rounded-xl border border-dashed border-black/15 bg-white p-8 text-center shadow-lg"><h2 className="text-xl font-black">{title}</h2><p className="mx-auto mt-2 max-w-lg text-black/60">{text}</p></div>;
}

function ErrorState({ title, message }: { title: string; message: string }) {
  return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800"><h2 className="font-black">{title}</h2><p className="mt-1 text-sm">{message}</p><button onClick={() => location.reload()} className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-bold">Tentar novamente</button></div>;
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const service = readFileSync(new URL('../services/meService.ts', import.meta.url), 'utf8');
const checkout = readFileSync(new URL('../app/checkout/page.tsx', import.meta.url), 'utf8');
const status = readFileSync(new URL('../components/CheckoutStatusPage.tsx', import.meta.url), 'utf8');
const canceled = readFileSync(new URL('../app/checkout/cancelado/page.tsx', import.meta.url), 'utf8');

test('checkout usa a rota Stripe canônica e envia somente itens e origem', () => {
  assert.match(service, /'\/api\/payments\/checkout'/);
  assert.match(service, /origin: 'SITE'/);
  assert.doesNotMatch(service, /subtotal.*cartBody|total.*cartBody|unitPrice.*cartBody/);
});

test('pedido é salvo antes do redirecionamento e checkout gratuito não abre Stripe', () => {
  assert.ok(checkout.indexOf('rememberCheckoutOrder(checkout.orderId)') < checkout.indexOf('window.location.assign(checkout.checkoutUrl)'));
  assert.match(checkout, /checkout\.status === 'PAGO'/);
});

test('retorno consulta backend, limita polling e libera ingressos apenas quando pago', () => {
  assert.match(status, /meService\.paymentStatus\(orderId\)/);
  assert.match(status, /attempts < 15/);
  assert.match(status, /status === 'PAGO'.*\/minha-conta\/ingressos/s);
  for (const state of ['FALHOU', 'CANCELADO', 'EXPIRADO', 'ESTORNADO', 'PARCIALMENTE_ESTORNADO', 'CONTESTADO', 'CONTESTACAO_PERDIDA']) assert.match(status, new RegExp(state));
});

test('retentativa bloqueia chamadas simultâneas e cancelamento não altera pedido', () => {
  assert.match(canceled, /busy\.current/);
  assert.match(canceled, /meService\.retryPayment\(id\)/);
  assert.doesNotMatch(canceled, /cancelOrder|status.*CANCELADO/);
});

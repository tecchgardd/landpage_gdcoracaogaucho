import { deleteCookie, readCookie, writeCookie } from '@/utils/cookies';

// Cookie estritamente necessário: guarda só o número do último pedido para retomar o status
// na volta do gateway (ou se a pessoa fechar a aba e voltar depois). Expira em 2 dias.
const ORDER_COOKIE = 'cg_checkout_order';
export function rememberCheckoutOrder(orderId: number) { writeCookie(ORDER_COOKIE, String(orderId), 2 * 24 * 60 * 60); }
export function recoverCheckoutOrder() { const id = Number(readCookie(ORDER_COOKIE)); return Number.isInteger(id) && id > 0 ? id : null; }
export function forgetCheckoutOrder() { deleteCookie(ORDER_COOKIE); }

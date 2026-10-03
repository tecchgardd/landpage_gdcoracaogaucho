const ORDER_KEY = 'cg_checkout_order_id';
export function rememberCheckoutOrder(orderId: number) { try { localStorage.setItem(ORDER_KEY, String(orderId)); } catch {} }
export function recoverCheckoutOrder() { try { const id = Number(localStorage.getItem(ORDER_KEY)); return Number.isInteger(id) && id > 0 ? id : null; } catch { return null; } }
export function forgetCheckoutOrder() { try { localStorage.removeItem(ORDER_KEY); } catch {} }

import type { Totals } from './types';

export const SHIPPING_CENTS = 495;
export const FREE_SHIPPING_FROM_CENTS = 5000;
export const MAX_UNITS_PER_PRODUCT = 10;

export function computeTotals(lines: { priceCents: number; quantity: number }[], discountPercent = 0): Totals {
  const subtotal = lines.reduce((sum, line) => sum + line.priceCents * line.quantity, 0);
  const discount = Math.round((subtotal * discountPercent) / 100);
  const afterDiscount = subtotal - discount;
  const shipping = subtotal === 0 || afterDiscount >= FREE_SHIPPING_FROM_CENTS ? 0 : SHIPPING_CENTS;

  return { subtotal, discount, shipping, total: afterDiscount + shipping };
}

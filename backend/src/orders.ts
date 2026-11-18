import { randomBytes } from 'node:crypto';
import { getProduct } from './catalog.js';
import { resolveDiscount } from './discounts.js';
import { badRequest, conflict, notFound } from './errors.js';
import { computeTotals } from './pricing.js';
import type { Customer, Order, OrderLine } from './types.js';

export const MAX_UNITS_PER_PRODUCT = 10;

const orders = new Map<string, Order>();

interface PlaceOrderInput {
  items?: unknown;
  discountCode?: unknown;
  customer?: unknown;
}

function parseCustomer(raw: unknown): Customer {
  const c = (raw ?? {}) as Record<string, unknown>;
  const fields = ['name', 'email', 'street', 'postalCode', 'city'] as const;

  for (const field of fields) {
    if (typeof c[field] !== 'string' || (c[field] as string).trim() === '') {
      throw badRequest(`Missing customer field: ${field}`);
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email as string)) {
    throw badRequest('Invalid email address');
  }

  return Object.fromEntries(fields.map((f) => [f, (c[f] as string).trim()])) as unknown as Customer;
}

function parseItems(raw: unknown): Map<number, number> {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw badRequest('An order needs at least one item');
  }

  const quantities = new Map<number, number>();
  for (const item of raw) {
    const productId = Number(item?.productId);
    const quantity = item?.quantity;
    if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1) {
      throw badRequest('Each item needs a productId and a positive whole quantity');
    }
    quantities.set(productId, (quantities.get(productId) ?? 0) + quantity);
  }
  return quantities;
}

function createOrderId(): string {
  return `SL-${randomBytes(4).toString('hex').toUpperCase()}`;
}

export function placeOrder(input: PlaceOrderInput): Order {
  const quantities = parseItems(input.items);
  const customer = parseCustomer(input.customer);
  const discount = input.discountCode ? resolveDiscount(input.discountCode) : null;

  const lines: OrderLine[] = [];
  for (const [productId, quantity] of quantities) {
    const product = getProduct(productId);
    if (quantity > MAX_UNITS_PER_PRODUCT) {
      throw badRequest(`At most ${MAX_UNITS_PER_PRODUCT} units of ${product.name} per order`);
    }
    if (quantity > product.stock) {
      throw conflict(`Only ${product.stock} units of ${product.name} left in stock`);
    }
    lines.push({ productId, name: product.name, emoji: product.emoji, priceCents: product.priceCents, quantity });
  }

  for (const line of lines) {
    getProduct(line.productId).stock -= line.quantity;
  }

  const order: Order = {
    id: createOrderId(),
    lines,
    discount,
    totals: computeTotals(lines, discount?.percent ?? 0),
    customer,
    createdAt: new Date().toISOString(),
  };

  orders.set(order.id, order);
  return order;
}

export function getOrder(id: string): Order {
  const order = orders.get(id);
  if (!order) throw notFound(`Order ${id} not found`);
  return order;
}

import type { Customer, Discount, Order, Product } from './types';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...init?.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(body.error ?? `Request failed (${res.status})`, res.status);
  }
  return body as T;
}

export interface ProductFilters {
  q?: string;
  category?: string;
  sort?: string;
}

export const api = {
  products(filters: ProductFilters = {}) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
    const query = params.toString();
    return request<Product[]>(`/products${query ? `?${query}` : ''}`);
  },

  product(id: number) {
    return request<Product>(`/products/${id}`);
  },

  categories() {
    return request<string[]>('/categories');
  },

  validateDiscount(code: string) {
    return request<Discount>('/discounts/validate', { method: 'POST', body: JSON.stringify({ code }) });
  },

  placeOrder(payload: { items: { productId: number; quantity: number }[]; discountCode?: string; customer: Customer }) {
    return request<Order>('/orders', { method: 'POST', body: JSON.stringify(payload) });
  },

  order(id: string) {
    return request<Order>(`/orders/${encodeURIComponent(id)}`);
  },
};

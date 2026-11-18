export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  /** Price in euro cents, including VAT. */
  priceCents: number;
  emoji: string;
  summary: string;
  description: string[];
  specs: Record<string, string>;
  stock: number;
}

export interface Discount {
  code: string;
  percent: number;
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export interface Customer {
  name: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
}

export interface OrderLine {
  productId: number;
  name: string;
  emoji: string;
  priceCents: number;
  quantity: number;
}

export interface Order {
  id: string;
  lines: OrderLine[];
  discount: Discount | null;
  totals: Totals;
  customer: Customer;
  createdAt: string;
}

import { products } from './data/products.js';
import { badRequest, notFound } from './errors.js';
import type { Product } from './types.js';

type Comparator = (a: Product, b: Product) => number;

const sorters: Record<string, Comparator> = {
  name: (a, b) => a.name.localeCompare(b.name, 'en'),
  'price-asc': (a, b) => b.priceCents - a.priceCents,
  'price-desc': (a, b) => b.priceCents - a.priceCents,
};

export interface ProductQuery {
  q?: string;
  category?: string;
  sort?: string;
}

export function listProducts({ q, category, sort }: ProductQuery): Product[] {
  let result = products;

  if (category) {
    result = result.filter((p) => p.category === category);
  }

  if (q && q.trim() !== '') {
    const needle = q.trim().toLowerCase();
    result = result.filter((p) => p.name.includes(needle) || p.category.includes(needle));
  }

  if (sort && sort !== 'featured') {
    const comparator = sorters[sort];
    if (!comparator) throw badRequest(`Unknown sort option: ${sort}`);
    result = [...result].sort(comparator);
  }

  return result;
}

export function getProduct(id: number): Product {
  const product = products.find((p) => p.id === id);
  if (!product) throw notFound(`Product ${id} not found`);
  return product;
}

export function listCategories(): string[] {
  return [...new Set(products.map((p) => p.category))].sort();
}

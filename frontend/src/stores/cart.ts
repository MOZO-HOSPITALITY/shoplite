import { computed, reactive, watch } from 'vue';
import { MAX_UNITS_PER_PRODUCT, computeTotals } from '../pricing';
import type { CartItem, Discount, Product } from '../types';

const STORAGE_KEY = 'shoplite.cart';

interface CartState {
  items: CartItem[];
  discount: Discount | null;
}

function load(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CartState>;
      return { items: Array.isArray(parsed.items) ? parsed.items : [], discount: parsed.discount ?? null };
    }
  } catch {
    // Corrupt storage: start with an empty cart.
  }
  return { items: [], discount: null };
}

const state = reactive<CartState>(load());

watch(
  state,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  },
  { deep: true },
);

const itemCount = computed(() => state.items.reduce((sum, item) => sum + item.quantity, 0));
const totals = computed(() => computeTotals(state.items, state.discount?.percent ?? 0));

function maxFor(product: Pick<Product, 'stock'>): number {
  return Math.min(MAX_UNITS_PER_PRODUCT, product.stock);
}

function addItem(product: Product, quantity = 1): number {
  const existing = state.items.find((item) => item.productId === product.id);
  const current = existing?.quantity ?? 0;
  const max = maxFor(product);
  const next = Math.min(current + quantity, max);

  if (existing) {
    existing.quantity = next;
    existing.maxQuantity = max;
  } else if (next > 0) {
    state.items.push({
      productId: product.id,
      name: product.name,
      emoji: product.emoji,
      priceCents: product.priceCents,
      quantity: next,
      maxQuantity: max,
    });
  }

  return next - current;
}

function setQuantity(productId: number, quantity: number) {
  const item = state.items.find((i) => i.productId === productId);
  if (item) item.quantity = Math.max(1, Math.min(quantity, item.maxQuantity));
}

function removeItem(productId: number) {
  const index = state.items.findIndex((item) => item.productId === productId);
  if (index !== -1) state.items.splice(index);
}

function setDiscount(discount: Discount | null) {
  state.discount = discount;
}

function clear() {
  state.items = [];
  state.discount = null;
}

export function useCart() {
  return {
    items: computed(() => state.items),
    discount: computed(() => state.discount),
    itemCount,
    totals,
    addItem,
    setQuantity,
    removeItem,
    setDiscount,
    clear,
  };
}

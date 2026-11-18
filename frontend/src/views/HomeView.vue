<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../api';
import PageLayout from '../components/PageLayout.vue';
import ProductCard from '../components/ProductCard.vue';
import ProductQuickView from '../components/ProductQuickView.vue';
import { capitalize } from '../format';
import { useCart } from '../stores/cart';
import { showToast } from '../stores/toasts';
import type { Product } from '../types';

const route = useRoute();
const router = useRouter();
const cart = useCart();

const products = ref<Product[]>([]);
const categories = ref<string[]>([]);
const loading = ref(true);
const error = ref('');
const quickViewProduct = ref<Product | null>(null);

const queryValue = (key: string) => (typeof route.query[key] === 'string' ? (route.query[key] as string) : '');
const q = computed(() => queryValue('q'));
const category = computed(() => queryValue('category'));
const sort = computed(() => queryValue('sort') || 'featured');

const heading = computed(() => {
  if (q.value) return `Results for “${q.value}”`;
  if (category.value) return capitalize(category.value);
  return 'All products';
});

let latestRequest = 0;

async function load() {
  const request = ++latestRequest;
  loading.value = true;
  error.value = '';
  try {
    const result = await api.products({ q: q.value, category: category.value, sort: sort.value });
    if (request === latestRequest) products.value = result;
  } catch (e) {
    if (request === latestRequest) error.value = (e as Error).message;
  } finally {
    if (request === latestRequest) loading.value = false;
  }
}

function updateQuery(changes: Record<string, string | undefined>) {
  router.push({ query: { ...route.query, ...changes } });
}

function addToCart(product: Product, quantity = 1) {
  const added = cart.addItem(product, quantity);
  if (added > 0) {
    showToast(`${product.name} added to your cart`, 'success');
  } else {
    showToast(`You already have the maximum of ${product.name} in your cart`, 'error');
  }
}

onMounted(async () => {
  categories.value = await api.categories();
});

watch(() => [q.value, category.value, sort.value], load, { immediate: true });
</script>

<template>
  <PageLayout>
    <div class="list-header">
      <h1>{{ heading }}</h1>
      <label class="sort">
        Sort by
        <select :value="sort" @change="updateQuery({ sort: ($event.target as HTMLSelectElement).value })">
          <option value="featured">Featured</option>
          <option value="name">Name (A–Z)</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </label>
    </div>

    <p v-if="error" class="alert alert--error">{{ error }}</p>
    <p v-else-if="loading" class="muted">Loading products…</p>
    <p v-else-if="products.length === 0" class="muted">No products match your search.</p>

    <div v-else class="product-grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @add="addToCart(product)"
        @quick-view="quickViewProduct = $event"
      />
    </div>

    <ProductQuickView :product="quickViewProduct" @close="quickViewProduct = null" @add="addToCart" />

    <template #aside>
      <section class="filters">
        <h2>Categories</h2>
        <ul>
          <li>
            <button type="button" :class="{ active: !category }" @click="updateQuery({ category: undefined })">
              All products
            </button>
          </li>
          <li v-for="c in categories" :key="c">
            <button type="button" :class="{ active: category === c }" @click="updateQuery({ category: c })">
              {{ capitalize(c) }}
            </button>
          </li>
        </ul>
      </section>
    </template>
  </PageLayout>
</template>

<style scoped>
.list-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.list-header h1 {
  margin: 0;
}

.sort {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-subtle);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.filters h2 {
  margin: 0 0 12px;
  font-size: 16px;
}

.filters ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.filters button {
  width: 100%;
  padding: 8px 12px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--color-ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.filters button:hover {
  background: var(--color-muted);
}

.filters button.active {
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-weight: 600;
}
</style>

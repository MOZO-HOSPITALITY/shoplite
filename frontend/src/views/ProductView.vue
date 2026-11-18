<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { api } from '../api';
import { capitalize, formatPrice } from '../format';
import { MAX_UNITS_PER_PRODUCT } from '../pricing';
import { useCart } from '../stores/cart';
import { showToast } from '../stores/toasts';
import type { Product } from '../types';

const props = defineProps<{ id: number }>();
const cart = useCart();

const product = ref<Product | null>(null);
const error = ref('');
const quantity = ref(1);

const maxQuantity = computed(() => Math.min(MAX_UNITS_PER_PRODUCT, product.value?.stock ?? 0));
const quantityValid = computed(
  () => Number.isInteger(quantity.value) && quantity.value >= 1 && quantity.value <= maxQuantity.value,
);

watch(
  () => props.id,
  async (id) => {
    product.value = null;
    error.value = '';
    quantity.value = 1;
    try {
      product.value = await api.product(id);
    } catch (e) {
      error.value = (e as Error).message;
    }
  },
  { immediate: true },
);

function addToCart() {
  if (!product.value || !quantityValid.value) return;
  const added = cart.addItem(product.value, quantity.value);
  if (added > 0) {
    showToast(`${added} × ${product.value.name} added to your cart`, 'success');
  } else {
    showToast(`You already have the maximum of ${product.value.name} in your cart`, 'error');
  }
}
</script>

<template>
  <div class="product-page">
    <p v-if="error" class="alert alert--error">{{ error }}</p>

    <template v-else-if="product">
      <nav class="breadcrumbs">
        <RouterLink to="/">Shop</RouterLink>
        <span>/</span>
        <RouterLink :to="{ path: '/', query: { category: product.category } }">{{ capitalize(product.category) }}</RouterLink>
      </nav>

      <div class="product-page__grid">
        <div class="product-page__details">
          <div class="product-page__image" aria-hidden="true">{{ product.emoji }}</div>

          <h1>{{ product.name }}</h1>
          <p class="lead">{{ product.summary }}</p>

          <h2>About this product</h2>
          <p v-for="(paragraph, i) in product.description" :key="i">{{ paragraph }}</p>

          <h2>Specifications</h2>
          <table class="specs">
            <tbody>
              <tr v-for="(value, key) in product.specs" :key="key">
                <th scope="row">{{ key }}</th>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </table>

          <h2>Delivery & returns</h2>
          <p>Ordered on a working day before 22:00, delivered the next day. Free shipping on orders from € 50.</p>
          <p>Not happy? Return it within 30 days in its original packaging and we refund the full price.</p>
        </div>

        <aside class="buy-box">
          <p class="buy-box__price">{{ formatPrice(product.priceCents) }}</p>
          <p class="muted">Including VAT</p>

          <p v-if="product.stock === 0" class="stock stock--out">Out of stock</p>
          <p v-else-if="product.stock <= 5" class="stock stock--low">Only {{ product.stock }} left</p>
          <p v-else class="stock stock--in">In stock</p>

          <form class="buy-box__form" @submit.prevent="addToCart">
            <label for="quantity">Quantity</label>
            <input
              id="quantity"
              v-model.number="quantity"
              type="number"
              min="1"
              :max="maxQuantity"
              step="1"
              :disabled="product.stock === 0"
            />
            <p v-if="!quantityValid && product.stock > 0" class="field-error">
              Choose between 1 and {{ maxQuantity }}
            </p>
            <button type="submit" class="button button--block" :disabled="product.stock === 0 || !quantityValid">
              Add to cart
            </button>
          </form>
        </aside>
      </div>
    </template>

    <p v-else class="muted">Loading…</p>
  </div>
</template>

<style scoped>
.product-page {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 24px;
}

.breadcrumbs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  color: var(--color-subtle);
  font-size: 14px;
}

.breadcrumbs a {
  color: inherit;
}

.product-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  align-items: start;
  gap: 48px;
}

.product-page__image {
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 9;
  margin-bottom: 24px;
  border-radius: var(--radius-lg);
  background: var(--color-muted);
  font-size: 140px;
}

.product-page__details h1 {
  margin: 0 0 8px;
}

.product-page__details h2 {
  margin: 32px 0 12px;
  font-size: 18px;
}

.product-page__details p {
  line-height: 1.7;
}

.lead {
  color: var(--color-subtle);
  font-size: 18px;
}

.specs {
  width: 100%;
  border-collapse: collapse;
}

.specs th,
.specs td {
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
}

.specs th {
  width: 40%;
  color: var(--color-subtle);
  font-weight: 500;
}

.buy-box {
  position: sticky;
  top: 96px;
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.buy-box__price {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
}

.buy-box__form {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}

.buy-box__form label {
  font-weight: 600;
}

.buy-box__form input {
  width: 100%;
}

.field-error {
  margin: 0;
  color: var(--color-danger);
  font-size: 14px;
}

@media (max-width: 900px) {
  .product-page__grid {
    grid-template-columns: 1fr;
  }

  .buy-box {
    position: static;
  }
}
</style>

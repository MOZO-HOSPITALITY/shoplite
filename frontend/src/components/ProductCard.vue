<script setup lang="ts">
import { formatPrice } from '../format';
import type { Product } from '../types';

defineProps<{ product: Product }>();
defineEmits<{ quickView: [product: Product]; add: [product: Product] }>();
</script>

<template>
  <article class="product-card">
    <RouterLink :to="`/products/${product.id}`" class="product-card__image" :aria-label="product.name">
      <span aria-hidden="true">{{ product.emoji }}</span>
    </RouterLink>

    <div class="product-card__body">
      <p class="product-card__category">{{ product.category }}</p>
      <h3 class="product-card__name">
        <RouterLink :to="`/products/${product.id}`">{{ product.name }}</RouterLink>
      </h3>
      <p class="product-card__summary">{{ product.summary }}</p>
    </div>

    <div class="product-card__footer">
      <div>
        <p class="product-card__price">{{ formatPrice(product.priceCents) }}</p>
        <p v-if="product.stock === 0" class="stock stock--out">Out of stock</p>
        <p v-else-if="product.stock <= 5" class="stock stock--low">Only {{ product.stock }} left</p>
      </div>
      <div class="product-card__actions">
        <button type="button" class="button button--ghost" @click="$emit('quickView', product)">Quick view</button>
        <button type="button" class="button" :disabled="product.stock === 0" @click="$emit('add', product)">Add</button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  overflow: hidden;
}

.product-card__image {
  display: grid;
  place-items: center;
  aspect-ratio: 4 / 3;
  background: var(--color-muted);
  font-size: 64px;
  text-decoration: none;
}

.product-card__body {
  flex: 1;
  padding: 16px 16px 0;
}

.product-card__category {
  margin: 0;
  color: var(--color-subtle);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.product-card__name {
  margin: 4px 0 8px;
  font-size: 17px;
}

.product-card__name a {
  color: var(--color-ink);
  text-decoration: none;
}

.product-card__summary {
  margin: 0;
  color: var(--color-subtle);
  font-size: 14px;
}

.product-card__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
}

.product-card__price {
  margin: 0;
  font-weight: 700;
  font-size: 18px;
}

.product-card__actions {
  display: flex;
  gap: 8px;
}
</style>

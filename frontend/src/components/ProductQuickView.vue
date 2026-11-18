<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { formatPrice } from '../format';
import { MAX_UNITS_PER_PRODUCT } from '../pricing';
import type { Product } from '../types';
import QuantityStepper from './QuantityStepper.vue';

const props = defineProps<{ product: Product | null }>();
const emit = defineEmits<{ close: []; add: [product: Product, quantity: number] }>();

const dialog = ref<HTMLDialogElement>();
const quantity = ref(1);
const max = computed(() => Math.min(MAX_UNITS_PER_PRODUCT, props.product?.stock ?? 1));

watch(
  () => props.product !== null,
  (isOpen) => {
    if (isOpen) {
      quantity.value = 1;
      dialog.value?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.value?.close();
      document.body.style.overflow = '';
    }
  },
);

function close() {
  emit('close');
}

function onNativeClose() {
  if (props.product !== null) close();
}

function onDialogClick(event: MouseEvent) {
  if (event.target === dialog.value) close();
}

function add() {
  if (!props.product) return;
  emit('add', props.product, quantity.value);
  close();
}
</script>

<template>
  <dialog ref="dialog" class="quick-view" aria-labelledby="quick-view-title" @click="onDialogClick" @close="onNativeClose">
    <div class="quick-view__inner">
      <header class="quick-view__header">
        <h2 id="quick-view-title">{{ product?.name }}</h2>
        <button type="button" class="icon-button" aria-label="Close" @click="close">×</button>
      </header>

      <div v-if="product" class="quick-view__content">
        <div class="quick-view__image" aria-hidden="true">{{ product.emoji }}</div>
        <div>
          <p class="quick-view__price">{{ formatPrice(product.priceCents) }}</p>
          <p>{{ product.summary }}</p>
          <p v-if="product.stock === 0" class="stock stock--out">Out of stock</p>

          <div class="quick-view__actions">
            <QuantityStepper v-model="quantity" :max="max" />
            <button type="button" class="button" :disabled="product.stock === 0" @click="add">Add to cart</button>
          </div>

          <RouterLink :to="`/products/${product.id}`" @click="close">View full details →</RouterLink>
        </div>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.quick-view {
  width: min(640px, calc(100vw - 32px));
  padding: 0;
  border: 0;
  border-radius: var(--radius-lg);
  color: var(--color-ink);
  box-shadow: var(--shadow-lg);
}

.quick-view::backdrop {
  background: rgb(15 23 42 / 0.5);
}

.quick-view__inner {
  padding: 24px;
}

.quick-view__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.quick-view__header h2 {
  margin: 0;
  font-size: 20px;
}

.quick-view__content {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
}

.quick-view__image {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border-radius: var(--radius);
  background: var(--color-muted);
  font-size: 80px;
}

.quick-view__price {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.quick-view__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
}

@media (max-width: 600px) {
  .quick-view__content {
    grid-template-columns: 1fr;
  }
}
</style>

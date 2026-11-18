<script setup lang="ts">
import { formatPrice } from '../format';
import type { Discount, Totals } from '../types';

defineProps<{ totals: Totals; discount?: Discount | null; title?: string }>();
</script>

<template>
  <section class="summary">
    <h2 class="summary__title">{{ title ?? 'Order summary' }}</h2>
    <dl>
      <div>
        <dt>Subtotal</dt>
        <dd>{{ formatPrice(totals.subtotal) }}</dd>
      </div>
      <div v-if="totals.discount > 0">
        <dt>Discount<template v-if="discount"> ({{ discount.code }}, {{ discount.percent }}%)</template></dt>
        <dd>−{{ formatPrice(totals.discount) }}</dd>
      </div>
      <div>
        <dt>Shipping</dt>
        <dd>{{ totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping) }}</dd>
      </div>
      <div class="summary__total">
        <dt>Total</dt>
        <dd>{{ formatPrice(totals.total) }}</dd>
      </div>
    </dl>
    <slot />
  </section>
</template>

<style scoped>
.summary {
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.summary__title {
  margin: 0 0 16px;
  font-size: 18px;
}

dl {
  margin: 0;
}

dl > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
}

dt {
  color: var(--color-subtle);
}

dd {
  margin: 0;
  font-weight: 600;
}

.summary__total {
  margin-top: 8px;
  padding-top: 12px !important;
  border-top: 1px solid var(--color-border);
  font-size: 18px;
}

.summary__total dt {
  color: var(--color-ink);
  font-weight: 700;
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { api } from '../api';
import OrderSummary from '../components/OrderSummary.vue';
import PageLayout from '../components/PageLayout.vue';
import { formatPrice } from '../format';
import type { Order } from '../types';

const props = defineProps<{ id: string }>();

const order = ref<Order | null>(null);
const error = ref('');
const showPayment = ref(false);

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'short' });

watch(
  () => props.id,
  async (id) => {
    order.value = null;
    error.value = '';
    try {
      order.value = await api.order(id);
    } catch (e) {
      error.value = (e as Error).message;
    }
  },
  { immediate: true },
);

function printInvoice() {
  window.print();
}
</script>

<template>
  <PageLayout>
    <p v-if="error" class="alert alert--error">{{ error }}</p>
    <p v-else-if="!order" class="muted">Loading your order…</p>

    <article v-else class="invoice">
      <header class="invoice__header">
        <div>
          <p class="invoice__eyebrow">Thank you for your order!</p>
          <h1>Invoice {{ order.id }}</h1>
          <p class="muted">Placed on {{ dateFormat.format(new Date(order.createdAt)) }}</p>
        </div>
        <button type="button" class="button button--ghost no-print" @click="printInvoice">Print invoice</button>
      </header>

      <div class="invoice__columns">
        <section class="invoice__section">
          <h2>Ship to</h2>
          <address>
            {{ order.customer.name }}<br />
            {{ order.customer.street }}<br />
            {{ order.customer.postalCode }} {{ order.customer.city }}<br />
            {{ order.customer.email }}
          </address>
        </section>

        <section class="invoice__section invoice__payment">
          <button
            type="button"
            class="invoice__payment-toggle no-print"
            :aria-expanded="showPayment"
            @click="showPayment = !showPayment"
          >
            {{ showPayment ? 'Hide' : 'Show' }} payment details
          </button>
          <div class="invoice__payment-details" :class="{ 'invoice__payment-details--open': showPayment }">
            <OrderSummary :totals="order.totals" :discount="order.discount" title="Payment" />
          </div>
        </section>
      </div>

      <section class="invoice__section">
        <h2>Items</h2>
        <table class="invoice__lines">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Qty</th>
              <th scope="col">Price</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="line in order.lines" :key="line.productId">
              <td>{{ line.name }}</td>
              <td>{{ line.quantity }}</td>
              <td>{{ formatPrice(line.priceCents) }}</td>
              <td>{{ formatPrice(line.priceCents * line.quantity) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <p class="muted invoice__legal">
        ShopLite B.V. · Keizersgracht 1, 1015 CJ Amsterdam · KvK 12345678 · VAT NL001234567B01. Prices include VAT.
      </p>

      <RouterLink to="/" class="button no-print">Continue shopping</RouterLink>
    </article>
  </PageLayout>
</template>

<style scoped>
.invoice {
  max-width: 880px;
}

.invoice__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.invoice__eyebrow {
  margin: 0;
  color: var(--color-success);
  font-weight: 700;
}

.invoice__header h1 {
  margin: 4px 0;
}

.invoice__columns {
  display: grid;
  grid-template-columns: 1fr 320px;
  align-items: start;
  gap: 32px;
}

.invoice__section {
  margin-top: 32px;
}

.invoice__section h2 {
  margin: 0 0 12px;
  font-size: 16px;
}

address {
  font-style: normal;
  line-height: 1.6;
}

.invoice__payment-toggle {
  display: none;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-ink);
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.invoice__lines {
  width: 100%;
  border-collapse: collapse;
}

.invoice__lines th,
.invoice__lines td {
  padding: 10px 8px 10px 0;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
}

.invoice__lines th:nth-child(n + 2),
.invoice__lines td:nth-child(n + 2) {
  text-align: right;
}

.invoice__legal {
  margin: 32px 0 24px;
  font-size: 13px;
}

@media (max-width: 768px) {
  .invoice__columns {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .invoice__payment-toggle {
    display: block;
  }

  .invoice__payment-details {
    display: none;
    margin-top: 12px;
  }

  .invoice__payment-details--open {
    display: block;
  }
}
</style>

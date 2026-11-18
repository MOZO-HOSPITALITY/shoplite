<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../api';
import OrderSummary from '../components/OrderSummary.vue';
import PageLayout from '../components/PageLayout.vue';
import { formatPrice } from '../format';
import { useCart } from '../stores/cart';
import type { Customer } from '../types';

const router = useRouter();
const cart = useCart();
const { items, totals, discount } = cart;

const customer = reactive<Customer>({ name: '', email: '', street: '', postalCode: '', city: '' });
const placing = ref(false);
const error = ref('');

onMounted(() => {
  if (items.value.length === 0) router.replace('/cart');
});

async function placeOrder() {
  if (placing.value) return;
  placing.value = true;
  error.value = '';

  try {
    const order = await api.placeOrder({
      items: items.value.map(({ productId, quantity }) => ({ productId, quantity })),
      discountCode: discount.value?.code,
      customer: { ...customer },
    });
    cart.clear();
    router.push(`/orders/${order.id}`);
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    placing.value = false;
  }
}
</script>

<template>
  <PageLayout title="Checkout">
    <form id="checkout-form" class="checkout-form" @submit.prevent="placeOrder">
      <fieldset>
        <legend>Contact</legend>
        <label>
          Full name
          <input v-model="customer.name" type="text" autocomplete="name" required />
        </label>
        <label>
          Email
          <input v-model="customer.email" type="email" autocomplete="email" required />
        </label>
      </fieldset>

      <fieldset>
        <legend>Delivery address</legend>
        <label>
          Street and number
          <input v-model="customer.street" type="text" autocomplete="street-address" required />
        </label>
        <div class="row">
          <label>
            Postal code
            <input v-model="customer.postalCode" type="text" autocomplete="postal-code" required />
          </label>
          <label>
            City
            <input v-model="customer.city" type="text" autocomplete="address-level2" required />
          </label>
        </div>
      </fieldset>

      <p v-if="error" class="alert alert--error">{{ error }}</p>
    </form>

    <template #aside>
      <OrderSummary :totals="totals" :discount="discount">
        <ul class="checkout-items">
          <li v-for="item in items" :key="item.productId">
            <span>{{ item.quantity }} × {{ item.name }}</span>
            <span>{{ formatPrice(item.priceCents * item.quantity) }}</span>
          </li>
        </ul>
        <button type="submit" form="checkout-form" class="button button--block button--large" :disabled="placing">
          {{ placing ? 'Placing order…' : 'Place order' }}
        </button>
      </OrderSummary>
    </template>
  </PageLayout>
</template>

<style scoped>
.checkout-form {
  display: grid;
  gap: 24px;
}

fieldset {
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

legend {
  padding: 0 6px;
  font-weight: 700;
}

label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

.row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
}

.checkout-items {
  display: grid;
  gap: 6px;
  margin: 16px 0;
  padding: 16px 0 0;
  border-top: 1px solid var(--color-border);
  list-style: none;
  font-size: 14px;
}

.checkout-items li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
</style>

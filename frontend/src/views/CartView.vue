<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../api';
import OrderSummary from '../components/OrderSummary.vue';
import PageLayout from '../components/PageLayout.vue';
import QuantityStepper from '../components/QuantityStepper.vue';
import { formatPrice } from '../format';
import { useCart } from '../stores/cart';
import { showToast } from '../stores/toasts';

const router = useRouter();
const cart = useCart();
const { items, totals, discount } = cart;

const code = ref('');
const codeError = ref('');
const applying = ref(false);

async function applyCode() {
  codeError.value = '';
  applying.value = true;
  try {
    const result = await api.validateDiscount(code.value);
    cart.setDiscount(result);
    code.value = '';
    showToast(`Discount ${result.code} applied`, 'success');
  } catch (e) {
    codeError.value = (e as Error).message;
  } finally {
    applying.value = false;
  }
}

function remove(productId: number, name: string) {
  cart.removeItem(productId);
  showToast(`${name} removed from your cart`);
}
</script>

<template>
  <PageLayout title="Your cart">
    <div v-if="items.length === 0" class="empty">
      <p>Your cart is empty.</p>
      <RouterLink to="/" class="button">Continue shopping</RouterLink>
    </div>

    <ul v-else class="cart-lines">
      <li v-for="item in items" :key="item.productId" class="cart-line">
        <span class="cart-line__emoji" aria-hidden="true">{{ item.emoji }}</span>
        <div class="cart-line__info">
          <RouterLink :to="`/products/${item.productId}`" class="cart-line__name">{{ item.name }}</RouterLink>
          <span class="muted">{{ formatPrice(item.priceCents) }} each</span>
        </div>
        <QuantityStepper
          :model-value="item.quantity"
          :max="item.maxQuantity"
          @update:model-value="cart.setQuantity(item.productId, $event)"
        />
        <span class="cart-line__total">{{ formatPrice(item.priceCents * item.quantity) }}</span>
        <button type="button" class="link-button" @click="remove(item.productId, item.name)">Remove</button>
      </li>
    </ul>

    <template v-if="items.length > 0" #aside>
      <OrderSummary :totals="totals" :discount="discount">
        <form class="discount-form" @submit.prevent="applyCode">
          <label for="discount-code">Discount code</label>
          <div class="discount-form__row">
            <input id="discount-code" v-model="code" type="text" autocomplete="off" placeholder="Enter code" />
            <button type="submit" class="button button--ghost" :disabled="applying || !code.trim()">Apply</button>
          </div>
          <p v-if="codeError" class="field-error">{{ codeError }}</p>
          <button v-if="discount" type="button" class="link-button" @click="cart.setDiscount(null)">
            Remove discount {{ discount.code }}
          </button>
        </form>
      </OrderSummary>
    </template>
  </PageLayout>

  <div v-if="items.length > 0" class="checkout-bar-spacer" aria-hidden="true"></div>
  <div v-if="items.length > 0" class="checkout-bar">
    <div class="checkout-bar__inner">
      <div>
        <span class="muted">Total</span>
        <strong class="checkout-bar__total">{{ formatPrice(totals.total) }}</strong>
      </div>
      <button type="button" class="button button--large" @click="router.push('/checkout')">Checkout</button>
    </div>
  </div>
</template>

<style scoped>
.empty {
  display: grid;
  justify-items: start;
  gap: 16px;
}

.cart-lines {
  margin: 0;
  padding: 0;
  list-style: none;
}

.checkout-bar-spacer {
  height: 96px;
}

.cart-line {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) auto 100px auto;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}

.cart-line__emoji {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius);
  background: var(--color-muted);
  font-size: 28px;
}

.cart-line__info {
  display: grid;
  gap: 2px;
}

.cart-line__name {
  color: var(--color-ink);
  font-weight: 600;
  text-decoration: none;
}

.cart-line__total {
  font-weight: 700;
  text-align: right;
}

.discount-form {
  display: grid;
  gap: 8px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.discount-form label {
  font-weight: 600;
}

.discount-form__row {
  display: flex;
  gap: 8px;
}

.discount-form__row input {
  flex: 1;
  min-width: 0;
}

.field-error {
  margin: 0;
  color: var(--color-danger);
  font-size: 14px;
}

.checkout-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -4px 16px rgb(15 23 42 / 0.06);
}

.checkout-bar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 16px 24px;
}

.checkout-bar__total {
  display: block;
  font-size: 22px;
}

@media (max-width: 640px) {
  .cart-line {
    grid-template-columns: 48px minmax(0, 1fr) auto;
  }

  .cart-line__total {
    grid-column: 2;
    text-align: left;
  }
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { capitalize } from '../format';
import { useCart } from '../stores/cart';

defineProps<{ categories: string[] }>();

const route = useRoute();
const { itemCount } = useCart();
const open = ref(false);

watch(
  () => route.fullPath,
  () => (open.value = false),
);
</script>

<template>
  <div class="mobile-nav">
    <button type="button" class="mobile-nav__toggle" aria-label="Menu" :aria-expanded="open" @click="open = !open">
      ☰
    </button>

    <RouterLink to="/cart" class="mobile-nav__cart" aria-label="Cart">
      🛒
      <span class="badge">{{ itemCount }}</span>
    </RouterLink>

    <nav v-if="open" class="mobile-nav__panel">
      <RouterLink to="/">All products</RouterLink>
      <RouterLink v-for="category in categories" :key="category" :to="{ path: '/', query: { category } }">
        {{ capitalize(category) }}
      </RouterLink>
      <RouterLink to="/cart">Cart ({{ itemCount }})</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.mobile-nav {
  display: none;
}

.mobile-nav__toggle {
  border: 0;
  background: transparent;
  font-size: 22px;
  cursor: pointer;
}

.mobile-nav__cart {
  display: inline-flex;
  margin-left: 4px;
  align-items: center;
  gap: 4px;
  font-size: 20px;
  text-decoration: none;
}

.mobile-nav__panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 8px 16px 16px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
}

.mobile-nav__panel a {
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-ink);
  text-decoration: none;
}

@media (max-width: 768px) {
  .mobile-nav {
    display: block;
  }
}
</style>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../api';
import { useCart } from '../stores/cart';
import CategoryMenu from './CategoryMenu.vue';
import MobileNav from './MobileNav.vue';

const route = useRoute();
const router = useRouter();
const { itemCount } = useCart();

const categories = ref<string[]>([]);
const search = ref('');

onMounted(async () => {
  categories.value = await api.categories();
});

watch(
  () => route.query.q,
  (q) => {
    search.value = typeof q === 'string' ? q : '';
  },
  { immediate: true },
);

function submitSearch() {
  const q = search.value.trim();
  router.push({ path: '/', query: { ...(route.path === '/' ? route.query : {}), q: q || undefined } });
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <MobileNav :categories="categories" />

      <RouterLink to="/" class="app-header__logo">Shop<span>Lite</span></RouterLink>

      <CategoryMenu class="app-header__categories" :categories="categories" />

      <form class="app-header__search" role="search" @submit.prevent="submitSearch">
        <input v-model="search" type="search" placeholder="Search products" aria-label="Search products" />
      </form>

      <RouterLink to="/cart" class="app-header__cart">
        Cart
        <span class="badge">{{ itemCount }}</span>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.app-header__inner {
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 12px 24px;
}

.app-header__logo {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-ink);
  text-decoration: none;
}

.app-header__logo span {
  color: var(--color-accent);
}

.app-header__search {
  flex: 1;
}

.app-header__search input {
  width: 100%;
  max-width: 420px;
}

.app-header__cart {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: var(--radius);
  color: var(--color-ink);
  font-weight: 600;
  text-decoration: none;
}

.app-header__cart:hover {
  background: var(--color-muted);
}

@media (max-width: 768px) {
  .app-header__inner {
    gap: 12px;
    padding: 10px 16px;
  }

  .app-header__categories,
  .app-header__cart {
    display: none;
  }
}
</style>

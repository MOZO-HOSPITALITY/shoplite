<script setup lang="ts">
import { ref } from 'vue';
import { capitalize } from '../format';

defineProps<{ categories: string[] }>();

const open = ref(false);

function onFocusOut(event: FocusEvent) {
  const menu = event.currentTarget as HTMLElement;
  if (!menu.contains(event.relatedTarget as Node | null)) open.value = false;
}
</script>

<template>
  <div
    class="category-menu"
    @mouseenter="open = true"
    @mouseleave="open = false"
    @focusout="onFocusOut"
    @keydown.esc="open = false"
  >
    <button
      type="button"
      class="category-menu__trigger"
      :aria-expanded="open"
      aria-haspopup="true"
      @click="open = true"
    >
      Categories
      <span aria-hidden="true">▾</span>
    </button>

    <ul v-if="open" class="category-menu__list">
      <li>
        <RouterLink to="/" @click="open = false">All products</RouterLink>
      </li>
      <li v-for="category in categories" :key="category">
        <RouterLink :to="{ path: '/', query: { category } }" @click="open = false">
          {{ capitalize(category) }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.category-menu {
  position: relative;
}

.category-menu__trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 0;
  border-radius: var(--radius);
  background: transparent;
  color: var(--color-ink);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.category-menu__trigger:hover,
.category-menu__trigger[aria-expanded='true'] {
  background: var(--color-muted);
}

.category-menu__list {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  margin: 10px 0 0;
  padding: 8px;
  list-style: none;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
}

.category-menu__list a {
  display: block;
  padding: 8px 12px;
  border-radius: 6px;
  color: var(--color-ink);
  text-decoration: none;
}

.category-menu__list a:hover {
  background: var(--color-muted);
}
</style>

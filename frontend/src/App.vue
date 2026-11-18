<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import PromoBanner from './components/PromoBanner.vue';
import ToastRegion from './components/ToastRegion.vue';
</script>

<template>
  <PromoBanner />
  <AppHeader />
  <main class="app-main">
    <RouterView />
  </main>
  <footer class="app-footer">
    <p>© 2026 ShopLite · All prices include 21% VAT (books 9%) · Free shipping from € 50</p>
  </footer>
  <ToastRegion />
</template>

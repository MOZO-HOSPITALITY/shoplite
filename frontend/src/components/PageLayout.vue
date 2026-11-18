<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
  <div class="page-layout" :class="{ 'page-layout--with-aside': $slots.aside }">
    <div class="page-layout__main">
      <h1 v-if="title" class="page-layout__title">{{ title }}</h1>
      <slot />
    </div>
    <aside v-if="$slots.aside" class="page-layout__aside">
      <slot name="aside" />
    </aside>
  </div>
</template>

<style scoped>
.page-layout {
  display: grid;
  gap: 32px;
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 32px 24px;
}

.page-layout--with-aside {
  grid-template-columns: minmax(0, 1fr) 320px;
}

.page-layout__title {
  margin: 0 0 24px;
}

@media (max-width: 900px) {
  .page-layout--with-aside {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>

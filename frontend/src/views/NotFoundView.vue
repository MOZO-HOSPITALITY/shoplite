<template>
  <div class="not-found">
    <h1>Page not found</h1>
    <p class="muted">The page you are looking for does not exist.</p>
    <RouterLink to="/" class="button">Back to the shop</RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 64px 24px;
}
</style>

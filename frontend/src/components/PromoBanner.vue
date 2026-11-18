<script setup lang="ts">
import { ref } from 'vue';
import { promo } from '../config/promo';

const copied = ref(false);

async function copyCode() {
  await navigator.clipboard.writeText(promo.code);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}
</script>

<template>
  <div class="promo-banner">
    <span>{{ promo.headline }}</span>
    <span>
      Use code <strong class="promo-banner__code">{{ promo.code }}</strong>
    </span>
    <button type="button" class="promo-banner__copy" @click="copyCode">
      {{ copied ? 'Copied!' : 'Copy code' }}
    </button>
  </div>
</template>

<style scoped>
.promo-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 16px;
  padding: 8px 16px;
  background: var(--color-ink);
  color: #fff;
  font-size: 14px;
}

.promo-banner__code {
  letter-spacing: 0.05em;
}

.promo-banner__copy {
  padding: 2px 10px;
  border: 1px solid rgb(255 255 255 / 0.5);
  border-radius: 999px;
  background: transparent;
  color: inherit;
  font-size: 13px;
  cursor: pointer;
}

.promo-banner__copy:hover {
  background: rgb(255 255 255 / 0.12);
}
</style>

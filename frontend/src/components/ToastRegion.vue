<script setup lang="ts">
import { dismissToast, toasts } from '../stores/toasts';
</script>

<template>
  <div class="toast-region" role="status" aria-live="polite">
    <TransitionGroup name="toast">
      <div v-for="toast in toasts" :key="toast.id" class="toast" :class="`toast--${toast.kind}`">
        <span>{{ toast.message }}</span>
        <button type="button" class="toast__close" aria-label="Dismiss" @click="dismissToast(toast.id)">×</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-region {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  width: min(100%, 400px);
  padding: 24px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius);
  background: var(--color-ink);
  color: #fff;
  box-shadow: var(--shadow-lg);
}

.toast--success {
  background: var(--color-success);
}

.toast--error {
  background: var(--color-danger);
}

.toast__close {
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 18px;
  cursor: pointer;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue: number; min?: number; max?: number }>(), { min: 1, max: 10 });
const emit = defineEmits<{ 'update:modelValue': [value: number] }>();

function step(delta: number) {
  const next = Math.max(props.min, Math.min(props.max, props.modelValue + delta));
  if (next !== props.modelValue) emit('update:modelValue', next);
}
</script>

<template>
  <div class="stepper">
    <button type="button" aria-label="Decrease quantity" :disabled="modelValue <= min" @click="step(-1)">−</button>
    <span class="stepper__value" aria-live="polite">{{ modelValue }}</span>
    <button type="button" aria-label="Increase quantity" :disabled="modelValue >= max" @click="step(1)">+</button>
  </div>
</template>

<style scoped>
.stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.stepper button {
  width: 36px;
  height: 36px;
  border: 0;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.stepper button:disabled {
  color: var(--color-subtle);
  cursor: not-allowed;
}

.stepper__value {
  min-width: 32px;
  text-align: center;
  font-weight: 600;
}
</style>

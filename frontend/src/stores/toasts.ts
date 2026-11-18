import { reactive } from 'vue';

export interface Toast {
  id: number;
  message: string;
  kind: 'info' | 'success' | 'error';
}

const TOAST_DURATION_MS = 3500;

export const toasts = reactive<Toast[]>([]);
let nextId = 1;

export function dismissToast(id: number) {
  const index = toasts.findIndex((t) => t.id === id);
  if (index !== -1) toasts.splice(index, 1);
}

export function showToast(message: string, kind: Toast['kind'] = 'info') {
  const id = nextId++;
  toasts.push({ id, message, kind });
  setTimeout(() => dismissToast(id), TOAST_DURATION_MS);
}

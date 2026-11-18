import { badRequest } from './errors.js';
import type { Discount } from './types.js';

const campaigns: Discount[] = [
  { code: 'WELCOME10', percent: 10 },
  { code: 'STUDENT15', percent: 15 },
];

export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase();
}

export function resolveDiscount(raw: unknown): Discount {
  if (typeof raw !== 'string' || raw.trim() === '') {
    throw badRequest('Enter a discount code');
  }

  const code = normalizeCode(raw);
  const campaign = campaigns.find((c) => c.code === code);
  if (!campaign) {
    throw badRequest('Unknown discount code');
  }

  return { ...campaign };
}

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER!,
  pro: process.env.STRIPE_PRICE_PRO!,
  team: process.env.STRIPE_PRICE_TEAM!,
} as const;

export type PlanKey = keyof typeof PRICE_IDS;

// Traduce el price_id real de Stripe a nuestro nombre de plan interno.
// Compartido entre el webhook y la página de facturación.
export function planFromPriceId(priceId: string | undefined): PlanKey | null {
  if (!priceId) return null;
  const entry = Object.entries(PRICE_IDS).find(([, id]) => id === priceId);
  return (entry?.[0] as PlanKey) ?? null;
}

import { loadStripe, Stripe } from '@stripe/stripe-js';

export interface CheckoutItem {
  priceId?: string;
  productId: string;
  name: string;
  quantity: number;
  unitAmount: number;
  currency?: string;
}

export interface CheckoutSession {
  id: string;
  url?: string;
}

let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    stripePromise = key ? loadStripe(key) : Promise.resolve(null);
  }
  return stripePromise;
};

export const createCheckoutSession = async (items: CheckoutItem[]): Promise<void> => {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error('Stripe not initialized');
  }

  const response = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const session: CheckoutSession = await response.json();
  await stripe.redirectToCheckout({ sessionId: session.id });
};

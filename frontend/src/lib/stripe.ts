import { loadStripe, Stripe } from '@stripe/stripe-js';

// Holds the Stripe promise so it is only initialized once
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.warn('Stripe publishable key is not set in NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
    }
    stripePromise = loadStripe(key || '');
  }
  return stripePromise;
};

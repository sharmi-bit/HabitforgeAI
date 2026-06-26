import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const PLANS = {
  free: { name: "Free", price: 0, goals: 1, aiGenerations: 3 },
  premium: { name: "Premium", price: 999, goals: Infinity, aiGenerations: Infinity },
} as const;

export const STRIPE_PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY!,
  annual: process.env.STRIPE_PRICE_ANNUAL!,
};

/**
 * Stripe Products Configuration
 * 
 * This file defines the products available for purchase.
 * In production, you may want to fetch these from Stripe API or database.
 */

export interface StripeProduct {
  id: string;
  name: string;
  description: string;
  priceId: string;
  amount: number; // in cents
  currency: string;
}

// For now, we don't define fixed products since each booking is dynamic
// Prices are determined by the service and passed at checkout time

export const STRIPE_CONFIG = {
  currency: 'cad', // Canadian dollars
  locale: 'fr-CA', // French Canadian
  
  // Minimum charge amount (Stripe requirement)
  minAmount: 50, // $0.50 CAD in cents
  
  // Platform fee percentage (if using Stripe Connect)
  platformFeePercent: 10, // 10% platform fee
};

/**
 * Calculate platform fee for a booking amount
 */
export function calculatePlatformFee(amountInCents: number): number {
  return Math.round(amountInCents * (STRIPE_CONFIG.platformFeePercent / 100));
}

/**
 * Format amount for display
 */
export function formatAmount(amountInCents: number): string {
  return `${(amountInCents / 100).toFixed(2)} $`;
}

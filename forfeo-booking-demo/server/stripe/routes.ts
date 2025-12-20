import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import { TRPCError } from "@trpc/server";
import { STRIPE_CONFIG, calculatePlatformFee } from "./products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export const stripeRouter = router({
  /**
   * Create a checkout session for a booking
   */
  createCheckoutSession: publicProcedure
    .input(z.object({
      bookingId: z.number(),
      amount: z.number(), // in cents
      serviceName: z.string(),
      customerEmail: z.string().email(),
      customerName: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const origin = ctx.req.headers.origin || 'http://localhost:3000';
        
        // Calculate platform fee if using Stripe Connect
        const platformFee = calculatePlatformFee(input.amount);
        
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: STRIPE_CONFIG.currency,
                product_data: {
                  name: input.serviceName,
                  description: `Réservation Forfeo - ${input.serviceName}`,
                },
                unit_amount: input.amount,
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${origin}/confirmation?booking_id=${input.bookingId}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/?canceled=true`,
          customer_email: input.customerEmail,
          client_reference_id: input.bookingId.toString(),
          metadata: {
            bookingId: input.bookingId.toString(),
            customerEmail: input.customerEmail,
            customerName: input.customerName,
          },
          allow_promotion_codes: true,
          locale: 'fr',
          // If using Stripe Connect, add application_fee_amount
          // application_fee_amount: platformFee,
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error: any) {
        console.error('[Stripe] Error creating checkout session:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to create checkout session',
        });
      }
    }),

  /**
   * Get checkout session details
   */
  getCheckoutSession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        return {
          id: session.id,
          paymentStatus: session.payment_status,
          customerEmail: session.customer_email,
          amountTotal: session.amount_total,
        };
      } catch (error: any) {
        console.error('[Stripe] Error retrieving session:', error);
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Session not found',
        });
      }
    }),

  /**
   * Create a refund for a payment
   */
  createRefund: protectedProcedure
    .input(z.object({
      paymentIntentId: z.string(),
      amount: z.number().optional(), // Partial refund amount in cents
      reason: z.enum(['duplicate', 'fraudulent', 'requested_by_customer']).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const refund = await stripe.refunds.create({
          payment_intent: input.paymentIntentId,
          amount: input.amount,
          reason: input.reason,
        });

        return {
          id: refund.id,
          amount: refund.amount,
          status: refund.status,
        };
      } catch (error: any) {
        console.error('[Stripe] Error creating refund:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to create refund',
        });
      }
    }),

  /**
   * Get payment history for a customer
   */
  getPaymentHistory: protectedProcedure
    .input(z.object({ customerEmail: z.string().email() }))
    .query(async ({ input }) => {
      try {
        // Find customer by email
        const customers = await stripe.customers.list({
          email: input.customerEmail,
          limit: 1,
        });

        if (customers.data.length === 0) {
          return [];
        }

        const customer = customers.data[0];

        // Get payment intents for this customer
        const paymentIntents = await stripe.paymentIntents.list({
          customer: customer.id,
          limit: 100,
        });

        return paymentIntents.data.map(pi => ({
          id: pi.id,
          amount: pi.amount,
          currency: pi.currency,
          status: pi.status,
          created: pi.created,
          description: pi.description,
        }));
      } catch (error: any) {
        console.error('[Stripe] Error fetching payment history:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch payment history',
        });
      }
    }),
});

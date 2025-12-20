import { Request, Response } from "express";
import Stripe from "stripe";
import * as db from "../db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Webhook] Missing stripe-signature header");
    return res.status(400).send("Missing stripe-signature header");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ⚠️ CRITICAL: Handle test events
  if (event.id.startsWith('evt_test_')) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ 
      verified: true,
    });
  }

  console.log(`[Webhook] Received event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("[Webhook] Processing checkout.session.completed", session.id);

  const bookingId = session.metadata?.bookingId;
  if (!bookingId) {
    console.error("[Webhook] No bookingId in session metadata");
    return;
  }

  // Update booking with payment info
  await db.updateBooking(Number(bookingId), {
    stripePaymentIntentId: session.payment_intent as string,
    paymentStatus: "succeeded",
  });

  // TODO: Send confirmation email
  // TODO: Send notification to company

  console.log(`[Webhook] Booking ${bookingId} payment completed`);
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("[Webhook] Processing payment_intent.succeeded", paymentIntent.id);

  // Find booking by payment intent ID
  const bookingId = paymentIntent.metadata?.bookingId;
  if (!bookingId) {
    console.error("[Webhook] No bookingId in payment intent metadata");
    return;
  }

  await db.updateBooking(Number(bookingId), {
    paymentStatus: "succeeded",
  });

  console.log(`[Webhook] Booking ${bookingId} payment succeeded`);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("[Webhook] Processing payment_intent.payment_failed", paymentIntent.id);

  const bookingId = paymentIntent.metadata?.bookingId;
  if (!bookingId) {
    console.error("[Webhook] No bookingId in payment intent metadata");
    return;
  }

  await db.updateBooking(Number(bookingId), {
    paymentStatus: "failed",
    status: "cancelled",
  });

  // TODO: Send payment failed notification

  console.log(`[Webhook] Booking ${bookingId} payment failed`);
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log("[Webhook] Processing charge.refunded", charge.id);

  const paymentIntentId = charge.payment_intent as string;
  if (!paymentIntentId) {
    console.error("[Webhook] No payment intent in charge");
    return;
  }

  // Find booking by payment intent ID
  // Note: We need to add a helper function to find booking by payment intent
  // For now, we'll log it
  console.log(`[Webhook] Charge ${charge.id} refunded for payment intent ${paymentIntentId}`);

  // TODO: Update booking status to refunded
  // TODO: Send refund confirmation email
}

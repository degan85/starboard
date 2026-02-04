import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyWebhookSignature, LemonSqueezyWebhookEvent } from "@/lib/lemonsqueezy";

// Map variant IDs to plans
const VARIANT_TO_PLAN: Record<number, "PRO" | "BUSINESS"> = {
  [parseInt(process.env.LEMONSQUEEZY_PRO_VARIANT_ID || "0")]: "PRO",
  [parseInt(process.env.LEMONSQUEEZY_BUSINESS_VARIANT_ID || "0")]: "BUSINESS",
};

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") || "";
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";

    // Verify signature
    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event: LemonSqueezyWebhookEvent = JSON.parse(rawBody);
    const eventName = event.meta.event_name;
    const userId = event.meta.custom_data?.user_id;

    console.log(`Lemon Squeezy webhook: ${eventName}`, { userId });

    if (!userId) {
      console.error("No user_id in webhook custom_data");
      return NextResponse.json({ error: "No user_id" }, { status: 400 });
    }

    switch (eventName) {
      case "subscription_created": {
        const { attributes } = event.data;
        const plan = VARIANT_TO_PLAN[attributes.variant_id] || "FREE";
        
        await db.user.update({
          where: { id: userId },
          data: {
            plan,
            lsCustomerId: String(attributes.customer_id),
            lsSubscriptionId: event.data.id,
            lsVariantId: String(attributes.variant_id),
            lsCurrentPeriodEnd: attributes.renews_at ? new Date(attributes.renews_at) : null,
            lsCancelledAt: null, // Clear any previous cancellation
          },
        });
        
        console.log(`User ${userId} subscribed to ${plan}`);
        break;
      }

      case "subscription_updated": {
        const { attributes } = event.data;
        const plan = VARIANT_TO_PLAN[attributes.variant_id] || "FREE";
        
        // Check if subscription is cancelled (scheduled for cancellation)
        const isCancelled = attributes.cancelled;
        
        await db.user.update({
          where: { id: userId },
          data: {
            plan,
            lsCustomerId: String(attributes.customer_id),
            lsSubscriptionId: event.data.id,
            lsVariantId: String(attributes.variant_id),
            lsCurrentPeriodEnd: attributes.renews_at ? new Date(attributes.renews_at) : 
                               (attributes.ends_at ? new Date(attributes.ends_at) : null),
            lsCancelledAt: isCancelled ? new Date() : null,
          },
        });
        
        console.log(`User ${userId} subscription updated: ${plan}, cancelled: ${isCancelled}`);
        break;
      }

      case "subscription_cancelled":
      case "subscription_expired": {
        // Subscription has actually ended - downgrade to FREE
        await db.user.update({
          where: { id: userId },
          data: {
            plan: "FREE",
            lsSubscriptionId: null,
            lsVariantId: null,
            lsCurrentPeriodEnd: null,
            lsCancelledAt: null,
            lsCustomerId: null,
          },
        });
        
        console.log(`User ${userId} downgraded to FREE (subscription ended)`);
        break;
      }

      case "subscription_payment_success": {
        const { attributes } = event.data;
        
        await db.user.update({
          where: { id: userId },
          data: {
            lsCurrentPeriodEnd: attributes.renews_at ? new Date(attributes.renews_at) : null,
            lsCancelledAt: null, // Payment success clears cancellation
          },
        });
        
        console.log(`User ${userId} payment successful`);
        break;
      }

      case "subscription_resumed": {
        const { attributes } = event.data;
        
        await db.user.update({
          where: { id: userId },
          data: {
            lsCancelledAt: null,
            lsCurrentPeriodEnd: attributes.renews_at ? new Date(attributes.renews_at) : null,
          },
        });
        
        console.log(`User ${userId} subscription resumed`);
        break;
      }

      default:
        console.log(`Unhandled event: ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

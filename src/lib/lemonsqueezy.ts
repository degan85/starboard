import {
  lemonSqueezySetup,
  createCheckout,
  getSubscription,
} from "@lemonsqueezy/lemonsqueezy.js";

// Initialize Lemon Squeezy
export function initLemonSqueezy() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    throw new Error("LEMONSQUEEZY_API_KEY is not set");
  }
  lemonSqueezySetup({ apiKey });
}

// Create checkout URL
export async function createCheckoutUrl({
  variantId,
  userId,
  userEmail,
  userName,
}: {
  variantId: number;
  userId: string;
  userEmail: string;
  userName?: string;
}) {
  initLemonSqueezy();

  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  if (!storeId) {
    throw new Error("LEMONSQUEEZY_STORE_ID is not set");
  }

  const checkout = await createCheckout(storeId, variantId, {
    checkoutData: {
      email: userEmail,
      name: userName || undefined,
      custom: {
        user_id: userId,
      },
    },
    productOptions: {
      redirectUrl: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    },
  });

  return checkout.data?.data.attributes.url;
}

// Get subscription details
export async function getSubscriptionDetails(subscriptionId: string) {
  initLemonSqueezy();
  const subscription = await getSubscription(subscriptionId);
  return subscription.data?.data;
}

// Webhook event types
export type LemonSqueezyWebhookEvent = {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      store_id: number;
      customer_id: number;
      order_id: number;
      product_id: number;
      variant_id: number;
      product_name: string;
      variant_name: string;
      status: string;
      card_brand: string;
      card_last_four: string;
      pause: null | object;
      cancelled: boolean;
      trial_ends_at: null | string;
      billing_anchor: number;
      first_subscription_item: {
        id: number;
        subscription_id: number;
        price_id: number;
        quantity: number;
        created_at: string;
        updated_at: string;
      };
      urls: {
        update_payment_method: string;
        customer_portal: string;
      };
      renews_at: string;
      ends_at: null | string;
      created_at: string;
      updated_at: string;
      test_mode: boolean;
    };
  };
};

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require("crypto");
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  return signature === digest;
}

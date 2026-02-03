import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createCheckoutUrl } from "@/lib/lemonsqueezy";

// Variant IDs from Lemon Squeezy
const VARIANT_IDS = {
  PRO: parseInt(process.env.LEMONSQUEEZY_PRO_VARIANT_ID || "0"),
  BUSINESS: parseInt(process.env.LEMONSQUEEZY_BUSINESS_VARIANT_ID || "0"),
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await request.json();
    
    if (!plan || !["PRO", "BUSINESS"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const variantId = VARIANT_IDS[plan as keyof typeof VARIANT_IDS];
    if (!variantId) {
      return NextResponse.json({ error: "Plan not configured" }, { status: 500 });
    }

    const checkoutUrl = await createCheckoutUrl({
      variantId,
      userId: user.id,
      userEmail: user.email!,
      userName: user.name || undefined,
    });

    if (!checkoutUrl) {
      return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

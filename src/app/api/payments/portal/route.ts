import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSubscriptionDetails } from "@/lib/lemonsqueezy";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.lsSubscriptionId) {
      return NextResponse.json({ error: "No active subscription" }, { status: 400 });
    }

    // Get subscription details to get the customer portal URL
    const subscription = await getSubscriptionDetails(user.lsSubscriptionId);
    
    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    const portalUrl = subscription.attributes.urls.customer_portal;

    return NextResponse.json({ url: portalUrl });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json({ error: "Failed to get portal URL" }, { status: 500 });
  }
}

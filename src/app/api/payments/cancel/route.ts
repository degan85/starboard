import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { cancelUserSubscription } from "@/lib/lemonsqueezy";

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

    // Cancel the subscription
    await cancelUserSubscription(user.lsSubscriptionId);

    // Update user in database
    await db.user.update({
      where: { id: user.id },
      data: {
        plan: "FREE",
        lsSubscriptionId: null,
        lsVariantId: null,
        lsCurrentPeriodEnd: null,
      },
    });

    return NextResponse.json({ success: true, message: "Subscription cancelled" });
  } catch (error) {
    console.error("Cancel error:", error);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}

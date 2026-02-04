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

    if (user.lsCancelledAt) {
      return NextResponse.json({ error: "Subscription already cancelled" }, { status: 400 });
    }

    // Cancel at end of billing period (no refund)
    try {
      await cancelUserSubscription(user.lsSubscriptionId);
      console.log("Subscription scheduled for cancellation:", user.lsSubscriptionId);
    } catch (lsError) {
      console.error("Lemon Squeezy cancel error:", lsError);
      return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
    }

    // Mark as cancelled (but keep plan until period ends)
    await db.user.update({
      where: { id: user.id },
      data: {
        lsCancelledAt: new Date(),
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Subscription will be cancelled at the end of billing period",
      endsAt: user.lsCurrentPeriodEnd,
    });
  } catch (error) {
    console.error("Cancel error:", error);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}

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

    // Try to cancel on Lemon Squeezy (but don't fail if it errors)
    if (user.lsSubscriptionId) {
      try {
        await cancelUserSubscription(user.lsSubscriptionId);
        console.log("Lemon Squeezy subscription cancelled:", user.lsSubscriptionId);
      } catch (lsError) {
        console.error("Lemon Squeezy cancel error (continuing anyway):", lsError);
        // Continue to update DB even if LS fails
      }
    }

    // Always update user in database
    await db.user.update({
      where: { id: user.id },
      data: {
        plan: "FREE",
        lsSubscriptionId: null,
        lsCustomerId: null,
        lsVariantId: null,
        lsCurrentPeriodEnd: null,
      },
    });

    console.log("User downgraded to FREE:", user.email);

    return NextResponse.json({ success: true, message: "Subscription cancelled" });
  } catch (error) {
    console.error("Cancel error:", error);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}

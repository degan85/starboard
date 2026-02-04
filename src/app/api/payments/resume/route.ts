import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { resumeUserSubscription } from "@/lib/lemonsqueezy";

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
      return NextResponse.json({ error: "No subscription found" }, { status: 400 });
    }

    if (!user.lsCancelledAt) {
      return NextResponse.json({ error: "Subscription is not cancelled" }, { status: 400 });
    }

    // Resume subscription on Lemon Squeezy
    try {
      await resumeUserSubscription(user.lsSubscriptionId);
      console.log("Subscription resumed:", user.lsSubscriptionId);
    } catch (lsError) {
      console.error("Lemon Squeezy resume error:", lsError);
      return NextResponse.json({ error: "Failed to resume subscription" }, { status: 500 });
    }

    // Clear cancelled status
    await db.user.update({
      where: { id: user.id },
      data: {
        lsCancelledAt: null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Subscription resumed successfully",
    });
  } catch (error) {
    console.error("Resume error:", error);
    return NextResponse.json({ error: "Failed to resume subscription" }, { status: 500 });
  }
}

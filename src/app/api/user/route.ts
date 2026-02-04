import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        lsCurrentPeriodEnd: true,
        lsSubscriptionId: true,
        lsCancelledAt: true,
        createdAt: true,
        _count: {
          select: { projects: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get total testimonials count
    const testimonialCount = await db.testimonial.count({
      where: {
        project: {
          userId: user.id,
        },
      },
    });

    return NextResponse.json({
      user: {
        ...user,
        testimonialCount,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    const user = await db.user.update({
      where: { email: session.user.email },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

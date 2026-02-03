import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { getPlanLimits } from "@/lib/plans";

const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

// GET - List user's projects with plan info
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        projects: {
          include: {
            _count: {
              select: { testimonials: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const limits = getPlanLimits(user.plan);

    return NextResponse.json({ 
      projects: user.projects,
      plan: user.plan,
      limits: {
        maxProjects: limits.maxProjects,
        maxTestimonials: limits.maxTestimonials,
        canRemoveBranding: limits.removeBranding,
        canCustomColors: limits.customColors,
      },
      usage: {
        projectCount: user.projects.length,
      }
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST - Create new project
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

    // Check project limit based on plan
    const projectCount = await db.project.count({
      where: { userId: user.id },
    });

    const limits = getPlanLimits(user.plan);
    if (projectCount >= limits.maxProjects) {
      return NextResponse.json(
        { 
          error: `Project limit reached. ${user.plan} plan allows ${limits.maxProjects} project(s). Upgrade to create more.`,
          code: "LIMIT_REACHED"
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = projectSchema.parse(body);

    const project = await db.project.create({
      data: {
        name: validatedData.name,
        slug: generateSlug(validatedData.name),
        description: validatedData.description || null,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

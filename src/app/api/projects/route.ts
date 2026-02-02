import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateSlug } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

// GET - List user's projects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
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
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ projects: user.projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    // Check project limit based on plan
    const projectCount = await db.project.count({
      where: { userId: user.id },
    });

    const limits = { FREE: 1, PRO: 3, BUSINESS: 999 };
    if (projectCount >= limits[user.plan]) {
      return NextResponse.json(
        { error: `${user.plan} 플랜은 최대 ${limits[user.plan]}개의 프로젝트만 생성할 수 있습니다.` },
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
        { error: "유효하지 않은 데이터입니다.", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

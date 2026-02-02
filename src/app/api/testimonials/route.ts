import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Validation schema
const testimonialSchema = z.object({
  projectSlug: z.string().min(1),
  name: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal("")),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  content: z.string().min(10).max(2000),
  rating: z.number().min(1).max(5),
});

// POST - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = testimonialSchema.parse(body);

    // Find project by slug
    const project = await db.project.findUnique({
      where: { slug: validatedData.projectSlug },
    });

    if (!project) {
      return NextResponse.json(
        { error: "프로젝트를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // Create testimonial
    const testimonial = await db.testimonial.create({
      data: {
        projectId: project.id,
        name: validatedData.name,
        email: validatedData.email || null,
        company: validatedData.company || null,
        role: validatedData.role || null,
        content: validatedData.content,
        rating: validatedData.rating,
        approved: false, // 기본적으로 승인 대기
      },
    });

    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "유효하지 않은 데이터입니다.", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// GET - Get testimonials for widget (approved only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "프로젝트 slug가 필요합니다." },
        { status: 400 }
      );
    }

    const project = await db.project.findUnique({
      where: { slug },
      include: {
        testimonials: {
          where: { approved: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "프로젝트를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // CORS headers for widget
    return NextResponse.json(
      {
        project: {
          name: project.name,
          widgetTheme: project.widgetTheme,
          widgetLayout: project.widgetLayout,
          primaryColor: project.primaryColor,
        },
        testimonials: project.testimonials,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

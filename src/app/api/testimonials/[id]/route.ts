import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  approved: z.boolean().optional(),
  featured: z.boolean().optional(),
});

// PATCH - Update testimonial (approve/feature)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    // Check if user owns the testimonial's project
    const testimonial = await db.testimonial.findFirst({
      where: {
        id: params.id,
        project: {
          user: { email: session.user.email },
        },
      },
    });

    if (!testimonial) {
      return NextResponse.json({ error: "후기를 찾을 수 없습니다." }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updateSchema.parse(body);

    const updated = await db.testimonial.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "유효하지 않은 데이터입니다." },
        { status: 400 }
      );
    }
    console.error("Error updating testimonial:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// DELETE - Delete testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    // Check if user owns the testimonial's project
    const testimonial = await db.testimonial.findFirst({
      where: {
        id: params.id,
        project: {
          user: { email: session.user.email },
        },
      },
    });

    if (!testimonial) {
      return NextResponse.json({ error: "후기를 찾을 수 없습니다." }, { status: 404 });
    }

    await db.testimonial.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

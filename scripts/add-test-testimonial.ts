import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Find daegeun's project
  const project = await prisma.project.findFirst({
    where: { slug: { startsWith: "daegeun" } }
  });

  if (!project) {
    console.log("No project found");
    return;
  }

  // Add test testimonial
  const testimonial = await prisma.testimonial.create({
    data: {
      projectId: project.id,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      company: "Acme Inc",
      role: "Product Manager",
      content: "This product has completely transformed how we collect customer feedback. The widget looks beautiful and was incredibly easy to set up!",
      rating: 5,
      approved: true,
    }
  });

  console.log("Testimonial created:", testimonial);
}

main().catch(console.error).finally(() => prisma.$disconnect());

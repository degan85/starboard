import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany({
    select: { id: true, name: true, slug: true, userId: true }
  });
  console.log("Projects:", JSON.stringify(projects, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

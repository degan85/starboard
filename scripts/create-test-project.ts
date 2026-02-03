import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const user = await prisma.user.upsert({
    where: { email: "test@starboard.com" },
    update: {},
    create: {
      email: "test@starboard.com",
      name: "테스트 유저",
    },
  });

  console.log("User created:", user);

  // Create test project
  const project = await prisma.project.upsert({
    where: { slug: "demo" },
    update: {},
    create: {
      name: "데모 프로젝트",
      slug: "demo",
      userId: user.id,
      widgetTheme: "LIGHT",
      widgetLayout: "GRID",
      primaryColor: "#8B5CF6",
    },
  });

  console.log("Project created:", project);
  console.log("\n✅ 테스트 URL: /collect/demo");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Fix Korean slug
  const updated = await prisma.project.update({
    where: { id: "cml62iqfn000113i5pk9qztuf" },
    data: { slug: "daegeun-hulyxo" }
  });
  console.log("Updated:", updated);
}

main().catch(console.error).finally(() => prisma.$disconnect());

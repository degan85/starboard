import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.user.update({
    where: { email: "degan8535@gmail.com" },
    data: {
      plan: "FREE",
      lsSubscriptionId: null,
      lsCustomerId: null,
      lsVariantId: null,
      lsCurrentPeriodEnd: null,
    }
  });
  console.log("Updated:", updated);
}

main().catch(console.error).finally(() => prisma.$disconnect());

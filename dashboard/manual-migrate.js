/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Creating Role enum...');
        await prisma.$executeRawUnsafe(`CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');`);
    } catch (e) {
        console.log('Enum might already exist:', e.message);
    }

    try {
        console.log('Adding role to User...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'USER';`);
    } catch (e) {
        console.log('Column might already exist:', e.message);
    }

    try {
        console.log('Creating SubscriptionPlan table...');
        await prisma.$executeRawUnsafe(`
      CREATE TABLE "SubscriptionPlan" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "price" TEXT NOT NULL,
          "features" JSONB NOT NULL,
          "popular" BOOLEAN NOT NULL DEFAULT false,
          "checkoutUrl" TEXT NOT NULL,
          "active" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,

          CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
      );
    `);

        console.log('Adding unique constraint to SubscriptionPlan name...');
        await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "SubscriptionPlan_name_key" ON "SubscriptionPlan"("name");`);
    } catch (e) {
        console.log('Table might already exist:', e.message);
    }

    console.log('Migration complete!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

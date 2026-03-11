/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:761a529ed85fb0d673a17503f2291c327dd93b860cd91d019aaa9852010970d9@72.62.137.73:5432/postgres?schema=public'
});

async function main() {
    await client.connect();

    try {
        // Fix CompanyContext types and constraints
        console.log("Fixing CompanyContext...");
        await client.query(`ALTER TABLE "public"."CompanyContext" ALTER COLUMN "name" SET NOT NULL;`);

        // Safe conversion of TEXT to JSONB if it's currently TEXT
        try {
            await client.query(`ALTER TABLE "public"."CompanyContext" ALTER COLUMN "products" TYPE JSONB USING "products"::JSONB;`);
        } catch {
            console.log("Could not convert products to JSONB directly, ignoring if it is already JSONB.");
        }

        // Drop and recreate AgentConfig with exact Prisma specification
        console.log("Recreating AgentConfig...");
        await client.query(`DROP TABLE IF EXISTS "public"."AgentConfig" CASCADE;`);
        await client.query(`
    CREATE TABLE "public"."AgentConfig" (
      "id" TEXT NOT NULL,
      "companyId" TEXT NOT NULL,
      "active" BOOLEAN NOT NULL DEFAULT false,
      "instanceName" TEXT,
      "whatsappNumber" TEXT,
      "qrcodeString" TEXT,
      "connectionStatus" TEXT NOT NULL DEFAULT 'disconnected',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "AgentConfig_pkey" PRIMARY KEY ("id")
    );
    CREATE UNIQUE INDEX "AgentConfig_companyId_key" ON "public"."AgentConfig"("companyId");
    CREATE UNIQUE INDEX "AgentConfig_instanceName_key" ON "public"."AgentConfig"("instanceName");
    
    ALTER TABLE "public"."AgentConfig" ADD CONSTRAINT "AgentConfig_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."CompanyContext"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);

        // Fix foreign keys for relation bindings
        console.log("Fixing Foreign Keys...");
        await client.query(`
      ALTER TABLE "public"."Account" DROP CONSTRAINT IF EXISTS "Account_userId_fkey";
      ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      
      ALTER TABLE "public"."Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey";
      ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      
      ALTER TABLE "public"."CompanyContext" DROP CONSTRAINT IF EXISTS "CompanyContext_userId_fkey";
      ALTER TABLE "public"."CompanyContext" ADD CONSTRAINT "CompanyContext_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);

        console.log("Database schema fully synced with Prisma definitions.");
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main().catch(console.error);

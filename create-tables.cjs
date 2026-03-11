/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:761a529ed85fb0d673a17503f2291c327dd93b860cd91d019aaa9852010970d9@72.62.137.73:5432/postgres?schema=public'
});

async function main() {
  await client.connect();

  // Try to explicitly create the public schema just in case
  await client.query('CREATE SCHEMA IF NOT EXISTS "public";');

  // NextAuth and SaaS Tables
  const schemaSql = `
    CREATE TABLE IF NOT EXISTS "public"."User" (
      "id" TEXT NOT NULL,
      "name" TEXT,
      "email" TEXT,
      "emailVerified" TIMESTAMP(3),
      "image" TEXT,
      "password" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "public"."User"("email");

    CREATE TABLE IF NOT EXISTS "public"."Account" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "provider" TEXT NOT NULL,
      "providerAccountId" TEXT NOT NULL,
      "refresh_token" TEXT,
      "access_token" TEXT,
      "expires_at" INTEGER,
      "token_type" TEXT,
      "scope" TEXT,
      "id_token" TEXT,
      "session_state" TEXT,
      CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

    CREATE TABLE IF NOT EXISTS "public"."Session" (
      "id" TEXT NOT NULL,
      "sessionToken" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "expires" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "public"."Session"("sessionToken");

    CREATE TABLE IF NOT EXISTS "public"."VerificationToken" (
      "identifier" TEXT NOT NULL,
      "token" TEXT NOT NULL,
      "expires" TIMESTAMP(3) NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "public"."VerificationToken"("token");
    CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

    CREATE TABLE IF NOT EXISTS "public"."CompanyContext" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "name" TEXT,
      "basePrompt" TEXT DEFAULT 'Você é um assistente prestativo.',
      "products" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "CompanyContext_pkey" PRIMARY KEY ("id")
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "CompanyContext_userId_key" ON "public"."CompanyContext"("userId");

    CREATE TABLE IF NOT EXISTS "public"."AgentConfig" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "instanceName" TEXT NOT NULL,
      "evolutionApiToken" TEXT,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "AgentConfig_pkey" PRIMARY KEY ("id")
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "AgentConfig_userId_key" ON "public"."AgentConfig"("userId");
    CREATE UNIQUE INDEX IF NOT EXISTS "AgentConfig_instanceName_key" ON "public"."AgentConfig"("instanceName");
  `;

  try {
    console.log("Creating tables...");
    await client.query(schemaSql);
    console.log("Tables created successfully or already existed.");

    // Verify
    const res = await client.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public';");
    console.log("Tables in public schema:", res.rows.map(r => r.tablename));

  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    await client.end();
  }
}
main().catch(console.error);

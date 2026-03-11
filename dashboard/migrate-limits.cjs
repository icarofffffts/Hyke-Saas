/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:761a529ed85fb0d673a17503f2291c327dd93b860cd91d019aaa9852010970d9@72.62.137.73:5432/postgres?schema=public'
});

async function main() {
    await client.connect();

    try {
        console.log("Adding plan and documents to CompanyContext...");
        await client.query(`ALTER TABLE "public"."CompanyContext" ADD COLUMN IF NOT EXISTS "plan" TEXT NOT NULL DEFAULT 'BASIC';`);
        await client.query(`ALTER TABLE "public"."CompanyContext" ADD COLUMN IF NOT EXISTS "documents" JSONB;`);

        console.log("Updating AgentConfig for 1-to-N relation...");
        // Drop the unique constraint on companyId to allow multiple connections per company
        await client.query(`ALTER TABLE "public"."AgentConfig" DROP CONSTRAINT IF EXISTS "AgentConfig_companyId_key";`);
        await client.query(`DROP INDEX IF EXISTS "AgentConfig_companyId_key";`);

        console.log("Database schema successfully upgraded for plans and multi-agents.");
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
main().catch(console.error);

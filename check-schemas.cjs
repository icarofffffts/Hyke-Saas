/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:761a529ed85fb0d673a17503f2291c327dd93b860cd91d019aaa9852010970d9@72.62.137.73:5432/postgres'
});

async function main() {
    await client.connect();
    const res = await client.query('SELECT schema_name FROM information_schema.schemata;');
    console.log(res.rows.map(r => r.schema_name));
    await client.end();
}
main().catch(console.error);

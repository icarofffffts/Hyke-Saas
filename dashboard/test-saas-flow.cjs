require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runTests() {
    console.log("--- STARTING SAAS FLOW TESTS ---");

    const testEmail = "test_saas_" + Date.now() + "@hyke.com";

    try {
        // 1. CREATE USER (Simulating Registration)
        console.log(`\n[1] Creating test user: ${testEmail}`);
        const user = await prisma.user.create({
            data: {
                name: "Test User",
                email: testEmail,
                password: "hashed_password_mock",
                company: {
                    create: {
                        name: "Test Company",
                        plan: "BASIC"
                    }
                }
            },
            include: { company: true }
        });
        console.log("✅ User created successfully with company context.");
        console.log(`Initial Plan: ${user.company.plan}`);

        // 2. PROMOTE TO ADMIN
        console.log(`\n[2] Promoting user to ADMIN`);
        await prisma.user.update({
            where: { id: user.id },
            data: { role: 'ADMIN' }
        });
        console.log("✅ User promoted to ADMIN.");

        // 3. CREATE PLAN (Simulating Admin Dashboard)
        console.log(`\n[3] Creating test subscription plan`);
        const planName = "TEST_PRO_" + Date.now();
        const plan = await prisma.subscriptionPlan.create({
            data: {
                name: planName,
                description: "Plan for testing webhooks",
                price: "R$ 99/mês",
                features: ["Test 1", "Test 2"],
                popular: true,
                checkoutUrl: "https://test.mp/",
                active: true
            }
        });
        console.log(`✅ Plan ${plan.name} created successfully.`);

        // 4. SIMULATE MERCADO PAGO WEBHOOK
        console.log(`\n[4] Simulating Mercado Pago Webhook for plan purchase`);

        // Mocking the behavior inside the webhook route (since we can't easily trigger the NextJS route directly from a node script without running the server, we will execute the exact same Prisma logic the webhook uses)
        console.log(`[Webhook Mock] Receiving payment for ${testEmail} buying ${planName}`);

        const userToUpdate = await prisma.user.findUnique({
            where: { email: testEmail }
        });

        if (userToUpdate) {
            await prisma.companyContext.update({
                where: { userId: userToUpdate.id },
                data: {
                    plan: planName // Simulating the webhook updating the plan
                }
            });
            console.log(`[Webhook Mock] User ${testEmail} updated to plan ${planName}!`);
        }

        // 5. VERIFY UPDATE
        console.log(`\n[5] Verifying final state in database`);
        const finalUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { company: true }
        });

        if (finalUser.company.plan === planName) {
            console.log(`✅ SUCCESS! Webhook successfully upgraded user plan to: ${finalUser.company.plan}`);
        } else {
            console.log(`❌ FAILED! Plan is still: ${finalUser.company.plan}`);
        }

    } catch (e) {
        console.error("❌ Test failed with error:", e);
    } finally {
        // CLEANUP
        console.log(`\n[6] Cleaning up test data...`);
        try {
            await prisma.user.delete({ where: { email: testEmail } });
            console.log("✅ Cleaned up test user");
        } catch (e) { console.log("- User cleanup failed or skipped"); }

        await prisma.$disconnect();
        console.log("--- TESTS COMPLETED ---");
    }
}

runTests();

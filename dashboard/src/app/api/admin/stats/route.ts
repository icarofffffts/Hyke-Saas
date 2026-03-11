import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (user?.role !== "ADMIN") {
        return new NextResponse("Forbidden", { status: 403 });
    }

    try {
        const [totalUsers, activePlans, latestUsers] = await Promise.all([
            prisma.user.count(),
            prisma.companyContext.groupBy({
                by: ['plan'],
                _count: {
                    plan: true
                }
            }),
            prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    company: {
                        select: {
                            plan: true
                        }
                    }
                }
            })
        ]);

        // Cálculo simples de faturamento estimado com base nos planos atuais
        // Preços hardcoded aqui para o cálculo rápido de stats
        const prices: Record<string, number> = {
            "GRÁTIS": 0,
            "BASIC": 0,
            "STARTER": 35.99,
            "PRO": 125.99,
            "ENTERPRISE": 589.99
        };

        let estimatedRevenue = 0;
        activePlans.forEach(group => {
            const planName = group.plan.toUpperCase();
            estimatedRevenue += (prices[planName] || 0) * group._count.plan;
        });

        return NextResponse.json({
            stats: {
                totalUsers,
                estimatedRevenue,
                activeUsers: totalUsers, // Simplificado
                conversions: activePlans.length
            },
            latestUsers,
            planDistribution: activePlans
        });
    } catch (error) {
        console.error("[ADMIN_STATS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Rota pública para a Landing Page (só retorna ativos)
export async function GET() {
    try {
        const plans = await prisma.subscriptionPlan.findMany({
            where: { active: true },
        });
        return NextResponse.json(plans);
    } catch {
        return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
    }
}

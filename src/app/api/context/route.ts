import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const instanceName = searchParams.get("instanceName");

        if (!instanceName) {
            return NextResponse.json({ error: "Instance name is required" }, { status: 400 });
        }

        const agent = await prisma.agentConfig.findUnique({
            where: { instanceName },
            include: {
                company: true
            }
        });

        if (!agent || !agent.company) {
            return NextResponse.json({ error: "Context not found for this instance" }, { status: 404 });
        }

        // Return a clean contextual payload for n8n AI
        return NextResponse.json({
            instanceName: agent.instanceName,
            companyName: agent.company.name,
            basePrompt: agent.company.basePrompt,
            products: agent.company.products,
            documents: agent.company.documents,
            plan: agent.company.plan
        });
    } catch {
        return NextResponse.json({ error: "Error fetching context" }, { status: 500 });
    }
}

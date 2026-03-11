import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/n8n/context/[instanceName]
export async function GET(
    req: Request,
    { params }: { params: Promise<{ instanceName: string }> }
) {
    try {
        const { instanceName } = await params;

        if (!instanceName) {
            return NextResponse.json({ error: "Instance name is required" }, { status: 400 });
        }

        const agent = await prisma.agentConfig.findUnique({
            where: { instanceName },
            include: {
                company: true,
            },
        });

        if (!agent || !agent.company) {
            return NextResponse.json({ error: "Agent or Company not found" }, { status: 404 });
        }

        // Retorna exatamente o que o n8n precisa para o Gemini
        return NextResponse.json({
            basePrompt: agent.company.basePrompt || "",
            products: agent.company.products || "",
            companyName: agent.company.name,
            active: agent.active
        });
    } catch (error) {
        console.error("Erro ao buscar contexto pro n8n:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

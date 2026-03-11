import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }

        const company = await prisma.companyContext.findUnique({
            where: { userId: session.user.id }
        });

        return NextResponse.json(company);
    } catch {
        return NextResponse.json({ message: "Erro ao buscar contexto" }, { status: 500 });
    }
}

const PLAN_LIMITS = {
    BASIC: { docs: 1, chars: 5000 },
    PRO: { docs: 5, chars: 30000 },
    ENTERPRISE: { docs: 99, chars: 200000 }
};

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }

        const { name, basePrompt, products, documents } = await req.json();

        // Retrieve existing company to check current plan
        const existingCompany = await prisma.companyContext.findUnique({
            where: { userId: session.user.id }
        });

        const currentPlan = existingCompany?.plan || "BASIC";
        const limits = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.BASIC;

        if (documents && Array.isArray(documents)) {
            if (documents.length > limits.docs) {
                return NextResponse.json(
                    { message: `Limite excedido: Seu plano ${currentPlan} permite até ${limits.docs} documento(s).` },
                    { status: 403 }
                );
            }
            const totalChars = documents.reduce((acc, doc) => acc + (doc.content?.length || 0), 0);
            if (totalChars > limits.chars) {
                return NextResponse.json(
                    { message: `Limite excedido: Seu plano ${currentPlan} permite até ${limits.chars} caracteres de base de conhecimento.` },
                    { status: 403 }
                );
            }
        }

        const company = await prisma.companyContext.upsert({
            where: { userId: session.user.id },
            update: {
                name,
                basePrompt,
                products,
                documents: documents !== undefined ? documents : existingCompany?.documents || []
            },
            create: {
                userId: session.user.id,
                name: name || "Minha Empresa",
                basePrompt,
                products,
                documents: documents || []
            }
        });

        return NextResponse.json(company);
    } catch {
        return NextResponse.json({ message: "Erro ao atualizar contexto" }, { status: 500 });
    }
}

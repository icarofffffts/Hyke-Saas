import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { message: "Dados incompletos" },
                { status: 400 }
            );
        }

        // Verificar se user existe
        const exists = await prisma.user.findUnique({
            where: { email },
        });

        if (exists) {
            return NextResponse.json(
                { message: "Usuário com este e-mail já existe" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Option: Auto-create CompanyContext for straightforward onboarding
        await prisma.companyContext.create({
            data: {
                userId: user.id,
                name: name,
            }
        });

        return NextResponse.json({ message: "Usuário criado com sucesso" }, { status: 201 });
    } catch (error) {
        console.error("Erro no registro:", error);
        return NextResponse.json(
            { message: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}

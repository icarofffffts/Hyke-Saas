import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return false;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    return user ? true : false;
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const isAdmin = await checkAdmin();
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();

        let featuresArray = body.features;
        if (typeof featuresArray === 'string') {
            featuresArray = featuresArray.split('\n').map((f: string) => f.trim()).filter((f: string) => f);
        }

        const updatedPlan = await prisma.subscriptionPlan.update({
            where: { id },
            data: {
                name: body.name,
                description: body.description,
                price: body.price.toString(),
                features: featuresArray,
                popular: body.popular,
                checkoutUrl: body.checkoutUrl,
                active: body.active,
            }
        });

        return NextResponse.json(updatedPlan);
    } catch (e: unknown) {
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const isAdmin = await checkAdmin();
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await prisma.subscriptionPlan.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (e: unknown) {
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
}

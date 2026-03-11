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

    const plans = await prisma.subscriptionPlan.findMany({
        orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(plans);
}

export async function PUT(req: Request) {
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
        const body = await req.json();
        const { id, name, description, price, features, popular, checkoutUrl, active } = body;

        const updatedPlan = await prisma.subscriptionPlan.update({
            where: { id },
            data: {
                name,
                description,
                price,
                features,
                popular,
                checkoutUrl,
                active
            }
        });

        return NextResponse.json(updatedPlan);
    } catch (error) {
        console.error("[ADMIN_PLANS_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

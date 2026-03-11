import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if ((dbUser as { role?: string })?.role !== "ADMIN") {
        // Redireciona usuários comuns de volta para o dashboard principal
        redirect("/dashboard");
    }

    return (
        <section className="animate-in fade-in duration-500">
            {children}
        </section>
    );
}

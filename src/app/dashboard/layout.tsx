import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Bot,
    LayoutDashboard,
    Settings,
    MessageSquare,
    LogOut,
    CreditCard,
    ShieldAlert
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { company: true }
    });

    const isAdmin = (dbUser as { role?: string })?.role === "ADMIN";
    const userPlanRaw = dbUser?.company?.plan || "BASIC";
    const userPlan = userPlanRaw.toUpperCase();

    // Trial Calculation (3 days)
    const createdAt = dbUser?.createdAt || new Date();
    const trialDays = 3;
    const expiresAt = new Date(createdAt);
    expiresAt.setDate(expiresAt.getDate() + trialDays);
    const isTrialExpired = new Date() > expiresAt && userPlan === "BASIC";

    const planLabels: Record<string, string> = {
        "BASIC": "Grátis",
        "GRÁTIS": "Grátis",
        "STARTER": "Starter",
        "PRO": "Pro",
        "ENTERPRISE": "Enterprise",
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex font-outfit selection:bg-cyan-500/30">
            {/* Sidebar */}
            <aside className="w-[280px] bg-black/60 backdrop-blur-lg border-r border-white/5 flex-col hidden md:flex relative z-20">
                {/* Subtle top glow */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>

                <div className="h-20 flex items-center px-8 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)] border border-white/10">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            Hyke AI
                        </span>
                    </div>
                </div>

                <nav className="flex-1 px-5 py-8 space-y-2 overflow-y-auto">
                    <div className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-4 px-3">Principal</div>
                    <Link
                        href="/dashboard"
                        className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 focus:bg-white/5 focus:text-white"
                    >
                        <LayoutDashboard className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                        Resumo Geral
                    </Link>
                    <Link
                        href="/dashboard/connection"
                        className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 focus:bg-white/5 focus:text-white"
                    >
                        <MessageSquare className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                        Conexão WhatsApp
                    </Link>

                    <div className="text-xs font-semibold text-gray-500 tracking-wider uppercase mt-8 mb-4 px-3">Configurações</div>
                    <Link
                        href="/dashboard/ai-context"
                        className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 focus:bg-white/5 focus:text-white"
                    >
                        <Settings className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
                        Contexto da IA
                    </Link>
                    <Link
                        href="/dashboard/subscription"
                        className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 focus:bg-white/5 focus:text-white"
                    >
                        <CreditCard className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
                        Assinatura
                    </Link>

                    {isAdmin && (
                        <>
                            <div className="text-xs font-semibold text-gray-500 tracking-wider uppercase mt-8 mb-4 px-3">Administração</div>
                            <Link
                                href="/dashboard/admin"
                                className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/10 rounded-xl transition-all duration-200 focus:bg-red-500/10 focus:text-white"
                            >
                                <ShieldAlert className="w-5 h-5 group-hover:text-red-300 transition-colors" />
                                Painel Admin
                            </Link>
                        </>
                    )}
                </nav>

                <div className="p-6 border-t border-white/5 bg-gradient-to-t from-black/50 to-transparent">
                    <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl bg-white/5 border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-900 to-indigo-900 flex items-center justify-center text-sm font-bold text-white shadow-inner border border-white/10">
                            {session.user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">
                                {session.user?.name}
                            </p>
                            <p className="text-xs text-cyan-500/80 truncate font-medium">
                                Plano {planLabels[userPlan] || userPlan}
                            </p>
                        </div>
                    </div>

                    {isTrialExpired && (
                        <Link
                            href="/dashboard/subscription"
                            className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all animate-pulse"
                        >
                            <ShieldAlert className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-tight">Teste Grátis Expirado</span>
                        </Link>
                    )}

                    <Link
                        href="/api/auth/signout"
                        className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair da conta
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                {/* Mobile Header */}
                <div className="md:hidden h-20 bg-black/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] border border-white/20">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-extrabold text-xl text-white">Hyke AI</span>
                    </div>
                    <Link href="/api/auth/signout" className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <LogOut className="w-5 h-5" />
                    </Link>
                </div>

                {/* Highly sophisticated dynamic ambient bg */}
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[60px]" />
                    <div className="absolute top-[20%] right-[-5%] w-[30%] h-[50%] bg-cyan-500/10 rounded-full blur-[80px]" />
                    <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] bg-purple-500/5 rounded-full blur-[50px]" />
                </div>

                <div className="flex-1 overflow-auto p-6 sm:p-10 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {children}
                </div>
            </main>
        </div>
    );
}

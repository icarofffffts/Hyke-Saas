import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CheckCircle2, Crown, Zap, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SubscriptionPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const [plansData, dbUser] = await Promise.all([
        prisma.subscriptionPlan.findMany({
            where: { active: true },
        }),
        prisma.user.findUnique({
            where: { email: session.user.email },
            include: { company: true }
        })
    ]);

    // Manual Sort Fallback (since DB sort is failing)
    const planOrder = ["GRÁTIS", "STARTER", "PRO", "ENTERPRISE"];
    const plans = plansData.sort((a, b) => {
        return planOrder.indexOf(a.name.toUpperCase()) - planOrder.indexOf(b.name.toUpperCase());
    });

    const userPlanRaw = dbUser?.company?.plan || "BASIC";
    // Normalização completa: BASIC -> GRÁTIS
    const normalizedUserPlan = userPlanRaw.toUpperCase() === "BASIC" ? "GRÁTIS" : userPlanRaw.toUpperCase();

    const getIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes("pro")) return <Zap className="w-6 h-6 text-cyan-400" />;
        if (lowerName.includes("enterprise")) return <Crown className="w-6 h-6 text-purple-400" />;
        return <CheckCircle2 className="w-6 h-6 text-cyan-500" />;
    };

    const getColors = (name: string, popular: boolean) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes("pro") || popular) {
            return "border-cyan-500/40 bg-gradient-to-b from-cyan-900/40 to-indigo-900/10 shadow-[0_0_40px_rgba(6,182,212,0.15)]";
        }
        if (lowerName.includes("enterprise")) {
            return "hover:border-purple-500/30 border-white/5 bg-black/40";
        }
        return "hover:border-cyan-500/30 border-white/5 bg-black/40";
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4 mb-16 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                <h1 className="text-5xl font-extrabold tracking-tight text-white font-outfit relative z-10">
                    Planos e Assinaturas
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto relative z-10">
                    Escale o atendimento da sua empresa com inteligência artificial de ponta.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => {
                    const isCurrentPlan = normalizedUserPlan === plan.name.toUpperCase();
                    const isEnterprise = plan.name.toLowerCase().includes("enterprise");

                    return (
                        <div
                            key={plan.id}
                            className={`relative group backdrop-blur-xl border rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 ${getColors(plan.name, plan.popular)}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-10 transform -translate-y-1/2">
                                    <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                        Mais Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-8 relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-xl border ${isEnterprise ? 'bg-purple-500/10 border-purple-500/20' : 'bg-cyan-500/20 border-cyan-500/30'}`}>
                                        {getIcon(plan.name)}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white font-outfit">{plan.name}</h3>
                                </div>
                                <p className="text-gray-400 text-sm mt-3">{plan.description}</p>
                            </div>

                            <div className="mb-8 flex items-baseline text-white relative z-10">
                                <span className={`text-5xl font-extrabold tracking-tight ${plan.popular ? 'text-white' : 'text-white'}`}>
                                    R$ {plan.price}
                                </span>
                                <span className={`ml-2 text-xl font-medium ${plan.popular ? 'text-cyan-100/40' : 'text-gray-500'}`}>/mês</span>
                            </div>

                            <ul className="mb-10 space-y-5 flex-1 relative z-10">
                                {(plan.features as string[]).map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-4">
                                        <CheckCircle2 className={`w-6 h-6 shrink-0 ${isEnterprise ? 'text-purple-500' : 'text-cyan-500'}`} />
                                        <span className={`${plan.popular ? 'text-gray-100' : 'text-gray-300'} font-medium tracking-wide`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {isCurrentPlan ? (
                                <button disabled className="relative z-10 w-full py-4 bg-white/10 text-white/50 rounded-xl font-bold border border-white/5 cursor-not-allowed">
                                    Plano Atual
                                </button>
                            ) : isEnterprise ? (
                                <Link
                                    href="https://wa.me/5531982382635?text=Preciso%20de%20ajuda%20com%20minha%20assinatura"
                                    className="relative z-10 w-full py-4 bg-transparent border border-white/10 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/10 text-white rounded-xl font-bold transition-all text-center"
                                >
                                    Falar com Consultor
                                </Link>
                            ) : (
                                <Link
                                    href={`/dashboard/checkout?planId=${plan.id}`}
                                    className={`relative z-10 w-full py-4 rounded-xl font-extrabold shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${plan.popular
                                        ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20'
                                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                                        }`}
                                >
                                    {userPlanRaw === "BASIC" ? "Fazer Upgrade Agora" : "Mudar de Plano"}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-16 p-8 bg-gradient-to-r from-gray-900 to-black border border-white/10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/5 blur-3xl pointer-events-none rounded-full"></div>
                <div className="relative z-10">
                    <h4 className="text-2xl text-white font-bold font-outfit">Buscando algo diferente?</h4>
                    <p className="text-gray-400 mt-2 text-lg">Nós criamos assinaturas sob medida para agências (White-Label) e franquias.</p>
                </div>
                <Link href="/contact" className="relative z-10 px-8 py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-xl transition-colors shrink-0">
                    Entrar em Contato
                </Link>
            </div>
        </div>
    );
}

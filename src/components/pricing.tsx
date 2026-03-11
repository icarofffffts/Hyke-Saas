'use client';

import { motion } from 'motion/react';
import { Check, Flame } from 'lucide-react';
import { useState, useEffect } from 'react';

const fallbackPlans = [
    {
        name: 'Grátis',
        description: 'Automação sem custos.',
        price: '0,00',
        features: ['1 Agente de IA', '500 msgs/mês'],
        popular: false,
    },
    {
        name: 'Starter',
        description: 'Primeiros passos.',
        price: '35,99',
        features: ['2 Agentes', '2.500 msgs'],
        popular: true,
    },
    {
        name: 'Pro',
        description: 'Crescimento real.',
        price: '125,99',
        features: ['3 Agentes', 'Ilimitado'],
        popular: false,
    },
    {
        name: 'Enterprise',
        description: 'Escala total.',
        price: '589,99',
        features: ['Ilimitado', 'Suporte 24/7'],
        popular: false,
    }
];

interface SubscriptionPlan {
    name: string;
    description: string;
    price: string;
    features: string[];
    popular: boolean;
    checkoutUrl?: string; // Made optional as it's removed from fallbackPlans
}

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Pricing() {
    const { data: session } = useSession();
    const router = useRouter();
    const [plans, setPlans] = useState<any[]>(fallbackPlans);

    const handleSubscribe = (planId: string) => {
        if (!session) {
            // Se não estiver logado, vai para o registro com o retorno para o checkout
            router.push(`/register?callbackUrl=/dashboard/checkout?planId=${planId}`);
        } else {
            router.push(`/dashboard/checkout?planId=${planId}`);
        }
    };

    useEffect(() => {
        fetch('/api/plans')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    const planOrder = ["GRÁTIS", "STARTER", "PRO", "ENTERPRISE"];
                    const sorted = (data as any[]).sort((a, b) => {
                        return planOrder.indexOf(a.name.toUpperCase()) - planOrder.indexOf(b.name.toUpperCase());
                    });
                    setPlans(sorted);
                }
            })
            .catch(console.error);
    }, []);

    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl"
                    >
                        Invista no Futuro do seu <span className="text-cyan-400">Atendimento</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-6 text-lg text-zinc-400"
                    >
                        Planos escaláveis sem taxas ocultas. Cancele quando quiser.
                    </motion.p>
                </div>

                <div className="grid gap-6 lg:grid-cols-4 max-w-full mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className={`relative flex flex-col p-8 rounded-3xl border ${plan.popular
                                ? 'border-cyan-500 bg-cyan-950/20 shadow-[0_0_40px_-15px_rgba(6,182,212,0.3)]'
                                : 'border-white/10 bg-white/5'
                                } backdrop-blur-lg`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="flex items-center gap-1 bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        <Flame className="w-3 h-3" /> Mais Escolhido
                                    </span>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-white font-display mb-2">{plan.name}</h3>
                                <p className="text-zinc-400 text-sm h-10">{plan.description}</p>
                            </div>

                            <div className="mb-8 flex items-baseline gap-2">
                                <span className="text-5xl font-extrabold text-white tracking-tight">
                                    <span className="text-2xl text-zinc-500 font-medium">R$</span> {plan.price}
                                </span>
                                <span className="text-zinc-500 font-medium">/mês</span>
                            </div>

                            <ul className="flex-1 space-y-4 mb-8">
                                {plan.features.map((feature: string) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <div className={`mt-1 shrink-0 bg-white/10 rounded-full p-0.5 ${plan.popular ? 'text-cyan-400' : 'text-zinc-300'}`}>
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="text-zinc-300 text-sm leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe((plan as any).id)}
                                className={`w-full py-4 rounded-xl font-bold text-center transition-all ${plan.popular
                                    ? 'bg-cyan-500 text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                Assinar o {plan.name}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

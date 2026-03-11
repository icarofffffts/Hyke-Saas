"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, PartyPopper } from "lucide-react";
import { motion } from "motion/react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const planId = searchParams.get("planId");

    useEffect(() => {
        // Forçar atualização do layout para sincronizar o novo plano
        router.refresh();
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mb-8 border border-cyan-500/50"
            >
                <CheckCircle2 className="w-12 h-12 text-cyan-500" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h1 className="text-4xl font-bold text-white mb-4">Pagamento Confirmado!</h1>
                <p className="text-xl text-white/60 mb-12 max-w-lg">
                    Parabéns! Sua assinatura foi processada com sucesso. Em alguns instantes seu acesso será liberado.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all"
                    >
                        Ir para o Dashboard
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => router.push("/dashboard/ai-context")}
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                    >
                        Configurar minha IA
                    </button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-16 flex items-center gap-2 text-white/40 text-sm"
            >
                <PartyPopper className="w-4 h-4" />
                Bem-vindo à Hyke Solutions
            </motion.div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Suspense fallback={null}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}

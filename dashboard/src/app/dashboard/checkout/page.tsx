"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Loader2, ArrowLeft, CheckCircle2, CreditCard, QrCode, ExternalLink } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ planId }: { planId: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/dashboard/checkout/success?planId=${planId}`,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message ?? "Ocorreu um erro no pagamento.");
        } else {
            setMessage("Ocorreu um erro inesperado.");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement options={{ layout: "tabs" }} />

            {message && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm font-medium">
                    {message}
                </div>
            )}

            <button
                disabled={isLoading || !stripe || !elements}
                className={`w-full py-4 rounded-xl font-bold text-center transition-all bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processando...
                    </div>
                ) : (
                    "Confirmar Assinatura"
                )}
            </button>

            <p className="text-xs text-center text-white/50">
                Pagamento processado de forma segura pelo Stripe.
            </p>
        </form>
    );
}

function CheckoutContent() {
    const searchParams = useSearchParams();
    const planId = searchParams.get("planId");
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [planName, setPlanName] = useState("");
    const [planPrice, setPlanPrice] = useState("");
    const [mpUrl, setMpUrl] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");
    const [pixData, setPixData] = useState<{ qr_code: string; qr_code_base64: string; id: string } | null>(null);
    const [isGeneratingPix, setIsGeneratingPix] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const router = useRouter();

    const fetchIntent = async (code?: string) => {
        try {
            const res = await fetch("/api/checkout/create-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId, couponCode: code || "" }),
            });
            const data = await res.json();

            if (data.error) {
                alert("Erro: " + data.error);
                return;
            }

            if (data.isFree) {
                router.refresh();
                router.push(`/dashboard/checkout/success?planId=${planId}&isFree=true`);
                return;
            }

            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
                if (code) alert("Cupom aplicado com sucesso!");
            }
        } catch (err) {
            console.error("Erro ao buscar intent:", err);
            alert("Erro ao aplicar cupom. Tente novamente.");
        }
    };

    useEffect(() => {
        if (!planId) {
            router.push("/");
            return;
        }

        const fetchPlanDetails = async () => {
            const res = await fetch("/api/plans");
            const plans = await res.json();
            const selectedPlan = plans.find((p: any) => p.id === planId);
            if (selectedPlan) {
                setPlanName(selectedPlan.name);
                setPlanPrice(selectedPlan.price);
                setMpUrl(selectedPlan.checkoutUrl);
            }
        };

        fetchIntent();
        fetchPlanDetails();
    }, [planId]);

    const handleApplyCoupon = async () => {
        const trimmedCode = couponCode.trim();
        if (!trimmedCode) return;
        setIsApplyingCoupon(true);
        await fetchIntent(trimmedCode);
        setIsApplyingCoupon(false);
    };

    const handleGeneratePix = async () => {
        setIsGeneratingPix(true);
        try {
            const res = await fetch("/api/checkout/mercado-pago/pix", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId, couponCode }),
            });
            const data = await res.json();
            if (data.isFree) {
                router.push(`/dashboard/checkout/success?planId=${planId}&isFree=true`);
                return;
            }
            if (data.qr_code) {
                setPixData(data);
            }
        } catch (err) {
            console.error("Erro ao gerar PIX:", err);
        } finally {
            setIsGeneratingPix(false);
        }
    };

    if (!planName) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                <p className="text-white/60">Carregando detalhes do plano...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Voltar para os planos
            </button>

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
                <div className="p-8 border-b border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl font-bold text-white">Finalizar Assinatura</h1>
                        <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/50 text-cyan-500 rounded-full text-xs font-bold uppercase tracking-wider">
                            Plano {planName}
                        </div>
                    </div>
                    <p className="text-white/60">Você está a um passo de turbinar seu atendimento com IA.</p>
                </div>

                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">R$ {planPrice}</span>
                            <span className="text-white/40">/mês</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Cupom"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 transition-colors w-24"
                            />
                            <button
                                onClick={handleApplyCoupon}
                                disabled={isApplyingCoupon}
                                className="text-xs font-bold text-cyan-500 hover:text-cyan-400 transition-colors"
                            >
                                {isApplyingCoupon ? "Aplicando..." : "Aplicar"}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            onClick={() => setPaymentMethod("card")}
                            className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${paymentMethod === "card"
                                ? "bg-cyan-500/10 border-cyan-500 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <CreditCard className="w-5 h-5" />
                            <span className="font-bold">Cartão</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod("pix")}
                            className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all ${paymentMethod === "pix"
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <QrCode className="w-5 h-5" />
                            <span className="font-bold">PIX</span>
                        </button>
                    </div>

                    {paymentMethod === "card" ? (
                        clientSecret ? (
                            <Elements
                                stripe={stripePromise}
                                options={{
                                    clientSecret,
                                    appearance: {
                                        theme: 'night',
                                        variables: {
                                            colorPrimary: '#06b6d4',
                                            colorBackground: '#0a0a0a',
                                            colorText: '#ffffff',
                                            colorDanger: '#ef4444',
                                            borderRadius: '12px',
                                        },
                                    }
                                }}
                            >
                                <CheckoutForm planId={planId!} />
                            </Elements>
                        ) : (
                            <div className="flex justify-center p-12">
                                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                            </div>
                        )
                    ) : (
                        <div className="space-y-6">
                            {pixData ? (
                                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-center space-y-6">
                                    <div className="mx-auto bg-white p-4 rounded-2xl w-fit shadow-xl shadow-emerald-500/10">
                                        <img
                                            src={`data:image/png;base64,${pixData.qr_code_base64}`}
                                            alt="PIX QR Code"
                                            className="w-48 h-48"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-white">QR Code gerado com sucesso!</h3>
                                        <p className="text-white/60 text-sm px-8">
                                            Escaneie o código acima com o app do seu banco para pagar.
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-white/5 space-y-4">
                                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Ou use o Copia e Cola</p>
                                        <div className="flex gap-2">
                                            <input
                                                readOnly
                                                value={pixData.qr_code}
                                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs text-white/60 font-mono focus:outline-none"
                                            />
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(pixData.qr_code);
                                                    alert("Código copiado!");
                                                }}
                                                className="px-4 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-colors"
                                            >
                                                Copiar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-center">
                                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <QrCode className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Pagamento via PIX</h3>
                                    <p className="text-white/60 text-sm mb-6">
                                        O pagamento via PIX é processado de forma segura e instantânea.
                                    </p>

                                    <button
                                        onClick={handleGeneratePix}
                                        disabled={isGeneratingPix}
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                    >
                                        {isGeneratingPix ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Gerando QR Code...
                                            </>
                                        ) : (
                                            <>
                                                Gerar QR Code PIX
                                                <ExternalLink className="w-4 h-4 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            <p className="text-xs text-center text-white/40 leading-relaxed px-8">
                                Assim que o pagamento for confirmado, seu plano será ativado automaticamente. Geralmente leva menos de 30 segundos.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                </div>
            }>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}

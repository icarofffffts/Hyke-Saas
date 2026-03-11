import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPaymentWebhook } from "@/lib/webhook";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20" as any,
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const planId = body.planId;
        const couponCode = body.couponCode?.trim();

        if (!planId) {
            return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
        }

        const plan = await prisma.subscriptionPlan.findUnique({
            where: { id: planId },
        });

        if (!plan) {
            return NextResponse.json({ error: "Plan not found" }, { status: 404 });
        }

        // Converter preço (ex: "35,99") para centavos (inteiro)
        const numericPrice = parseFloat(plan.price.replace(',', '.'));
        let amountInCents = Math.round(numericPrice * 100);
        let discountApplied = 0;

        // Validar Cupom se existir
        if (couponCode) {
            try {
                const coupon = await stripe.coupons.retrieve(couponCode);
                if (coupon.valid) {
                    if (coupon.percent_off) {
                        discountApplied = Math.round(amountInCents * (coupon.percent_off / 100));
                    } else if (coupon.amount_off) {
                        discountApplied = coupon.amount_off;
                    }
                    amountInCents = Math.max(0, amountInCents - discountApplied);
                }
            } catch (err) {
                console.log("Cupom inválido ou não encontrado:", couponCode);
                // Prossegue sem desconto se o cupom for inválido
            }
        }

        // Se o valor for 0 (cupom 100%), não criamos PaymentIntent no Stripe
        if (amountInCents <= 0) {
            // Ativar plano imediatamente no banco de dados para o usuário
            if (session?.user?.id) {
                const updatedUser = await prisma.user.update({
                    where: { id: session.user.id },
                    data: {
                        company: {
                            update: {
                                plan: plan.name.toUpperCase()
                            }
                        }
                    }
                });

                // Enviar Webhook para o n8n (Ativação Gratuita/Cupom)
                try {
                    await sendPaymentWebhook({
                        email: updatedUser.email!,
                        name: updatedUser.name || "User",
                        plan: plan.name,
                        amount: 0,
                        paymentMethod: "free",
                        date: new Date().toISOString(),
                        status: "approved"
                    });
                } catch (webhookErr) {
                    console.error("[Stripe API] Erro ao disparar webhook n8n:", webhookErr);
                }
            }

            return NextResponse.json({
                clientSecret: null,
                isFree: true,
                message: "Plano ativado gratuitamente via cupom!"
            });
        }

        // Criar o Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "brl",
            payment_method_types: ["card", "boleto"],
            metadata: {
                planId: plan.id,
                planName: plan.name,
                userId: session?.user?.id || "anonymous",
                couponCode: couponCode || "",
                discountApplied: discountApplied.toString(),
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error: any) {
        console.error("[Stripe API Error]:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

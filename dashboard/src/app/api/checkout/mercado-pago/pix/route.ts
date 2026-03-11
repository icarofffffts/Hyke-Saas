import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendPaymentWebhook } from "@/lib/webhook";
import Stripe from "stripe";

const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    options: { timeout: 5000 }
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20" as any,
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

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

        let numericPrice = parseFloat(plan.price.replace(',', '.'));

        // Validar Cupom via Stripe (Engine Unificada)
        if (couponCode) {
            try {
                const coupon = await stripe.coupons.retrieve(couponCode);
                if (coupon.valid) {
                    if (coupon.percent_off) {
                        numericPrice = numericPrice * (1 - (coupon.percent_off / 100));
                    } else if (coupon.amount_off) {
                        numericPrice = Math.max(0, numericPrice - (coupon.amount_off / 100));
                    }
                }
            } catch (err) {
                console.log("Cupom inválido no PIX:", couponCode);
            }
        }

        if (numericPrice <= 0) {
            // Ativar plano imediatamente no banco de dados
            if (session.user.id) {
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

                // Enviar Webhook para o n8n (Ativação Gratuita via PIX route)
                await sendPaymentWebhook({
                    email: updatedUser.email!,
                    name: updatedUser.name || "User",
                    plan: plan.name,
                    amount: 0,
                    paymentMethod: "free",
                    date: new Date().toISOString(),
                    status: "approved"
                });
            }

            return NextResponse.json({
                id: "free_" + Math.random().toString(36).substr(2, 9),
                isFree: true,
                message: "Plano ativado gratuitamente via cupom!"
            });
        }

        const payment = new Payment(client);

        const paymentData = {
            body: {
                transaction_amount: Number(numericPrice.toFixed(2)),
                description: `Plano ${plan.name} - Hyke Solutions`,
                payment_method_id: 'pix',
                payer: {
                    email: session.user.email!,
                    first_name: session.user.name?.split(' ')[0] || 'User',
                    last_name: session.user.name?.split(' ').slice(1).join(' ') || 'SaaS',
                },
                metadata: {
                    plan_id: plan.id,
                    user_id: session.user.id,
                    plan_name: plan.name,
                },
            },
        };

        const result = await payment.create(paymentData);

        return NextResponse.json({
            id: result.id,
            qr_code: result.point_of_interaction?.transaction_data?.qr_code,
            qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64,
            ticket_url: result.point_of_interaction?.transaction_data?.ticket_url,
        });

    } catch (error: any) {
        console.error("[Mercado Pago PIX Error]:", error);
        return NextResponse.json({ error: error.message || "Erro ao gerar PIX" }, { status: 500 });
    }
}

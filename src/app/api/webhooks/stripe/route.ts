import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPaymentWebhook } from "@/lib/webhook";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        if (!webhookSecret) {
            // Se não tiver secret (em desenvolvimento local sem stripe-cli), podemos pular a verificação
            // MAS EM PRODUÇÃO ISSO É OBRIGATÓRIO!
            event = JSON.parse(body);
        } else {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        }
    } catch (err: any) {
        console.error(`[Webhook Error]: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case "payment_intent.succeeded":
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const planId = paymentIntent.metadata.planId;
            const planName = paymentIntent.metadata.planName;

            // No Stripe, geralmente associamos o pagamento ao cliente pelo e-mail ou metadata
            const customerEmail = paymentIntent.receipt_email || paymentIntent.customer as string;

            console.log(`[Stripe Webhook] Pagamento aprovado para o plano ${planName} (ID: ${planId})`);

            // Se tivermos o email do cliente (metadata ou receipt), atualizamos no banco
            if (paymentIntent.metadata.userId) {
                const updatedUser = await prisma.user.update({
                    where: { id: paymentIntent.metadata.userId },
                    data: {
                        company: {
                            update: {
                                plan: planName.toUpperCase()
                            }
                        }
                    },
                    include: { company: true }
                });

                console.log(`[Stripe Webhook] Plano ${planName} ativado para o usuário ${paymentIntent.metadata.userId}`);

                // Enviar Webhook para o n8n
                await sendPaymentWebhook({
                    email: updatedUser.email!,
                    name: updatedUser.name || "User",
                    plan: planName,
                    amount: paymentIntent.amount / 100,
                    paymentMethod: "stripe",
                    date: new Date().toISOString(),
                    status: "approved"
                });
            }
            break;

        default:
            console.log(`[Stripe Webhook] Evento não processado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

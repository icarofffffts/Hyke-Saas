import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPaymentWebhook } from "@/lib/webhook";

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        // Mercado Pago envia o tipo no query param 'topic' ou 'type'
        const topic = url.searchParams.get("topic") || url.searchParams.get("type");
        const dataId = url.searchParams.get("id");

        console.log(`[Mercado Pago Webhook] Tópico: ${topic}, ID: ${dataId}`);

        if (topic === "payment" && dataId) {
            // Buscar detalhes do pagamento na API do Mercado Pago
            const response = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
                },
            });

            if (response.ok) {
                const payment = await response.json();

                // Se o status for aprovado
                if (payment.status === "approved") {
                    const userId = payment.metadata?.user_id;
                    const planName = payment.metadata?.plan_name;

                    if (userId && planName) {
                        const updatedUser = await prisma.user.update({
                            where: { id: userId },
                            data: {
                                company: {
                                    update: {
                                        plan: planName.toUpperCase()
                                    }
                                }
                            }
                        });

                        console.log(`[Webhook Sucesso] Plano ${planName} ativado para usuário ${userId}`);

                        // Enviar Webhook para o n8n
                        await sendPaymentWebhook({
                            email: updatedUser.email!,
                            name: updatedUser.name || "User",
                            plan: planName,
                            amount: payment.transaction_amount,
                            paymentMethod: "mercadopago",
                            date: new Date().toISOString(),
                            status: "approved"
                        });
                    }
                }
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (e: unknown) {
        console.error("[Webhook Error] Falha ao processar Mercado Pago:", (e as Error)?.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

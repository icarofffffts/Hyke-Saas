export async function sendPaymentWebhook(data: {
    email: string;
    name: string;
    plan: string;
    amount: number;
    paymentMethod: "stripe" | "mercadopago" | "free";
    date: string;
    status: string;
}) {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn("[Webhook Warning]: N8N_WEBHOOK_URL not defined in .env. Skipping webhook notification.");
        return;
    }

    console.log(`[Webhook Debug]: Attemping to send data to n8n. Email: ${data.email}, Method: ${data.paymentMethod}`);

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...data,
                source: "SaaS Dashboard",
                timestamp: new Date().toISOString(),
            }),
        });

        const responseText = await response.text();

        if (!response.ok) {
            console.error(`[Webhook Error]: Failed to send data to n8n. Status: ${response.status}, Response: ${responseText}`);
        } else {
            console.log("[Webhook Success]: Payment data sent to n8n. Response:", responseText);
        }
    } catch (error) {
        console.error("[Webhook Error]: Exception while sending data to n8n:", error);
    }
}

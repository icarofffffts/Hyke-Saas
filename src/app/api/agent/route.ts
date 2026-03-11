import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Allowed instances per plan
const PLAN_LIMITS: Record<string, number> = {
    BASIC: 1,
    PRO: 3,
    ENTERPRISE: 999
};

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({}, { status: 401 });

        const company = await prisma.companyContext.findUnique({
            where: { userId: session.user.id },
            include: { agents: true }
        });

        if (!company) return NextResponse.json([], { status: 404 });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let agents = (company as any).agents || [];

        // Fetch live status from Evolution API
        let EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
        const EVOLUTION_API_TOKEN = process.env.EVOLUTION_API_TOKEN;

        if (EVOLUTION_API_URL && EVOLUTION_API_TOKEN) {
            EVOLUTION_API_URL = EVOLUTION_API_URL.replace(/\/manager\/?$/, "").replace(/\/$/, "");

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            agents = await Promise.all(agents.map(async (agent: any) => {
                try {
                    const res = await fetch(`${EVOLUTION_API_URL}/instance/connectionState/${agent.instanceName}`, {
                        headers: { "apikey": EVOLUTION_API_TOKEN }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        const state = data?.instance?.state || data?.state;

                        if (state === "open") {
                            agent.connectionStatus = "connected";
                            agent.qrcodeString = null; // Don't show QR if connected
                        } else {
                            agent.connectionStatus = "disconnected";
                            // If disconnected, try to refresh the QR code
                            try {
                                const qrRes = await fetch(`${EVOLUTION_API_URL}/instance/connect/${agent.instanceName}`, {
                                    headers: { "apikey": EVOLUTION_API_TOKEN }
                                });
                                if (qrRes.ok) {
                                    const qrData = await qrRes.json();
                                    if (qrData?.base64) {
                                        agent.qrcodeString = qrData.base64;
                                        // Optionally update DB
                                        await prisma.agentConfig.update({
                                            where: { id: agent.id },
                                            data: { qrcodeString: qrData.base64, connectionStatus: "disconnected" }
                                        });
                                    }
                                }
                            } catch { }
                        }
                    }
                } catch {
                    console.error("Failed to fetch state for", agent.instanceName);
                }
                return agent;
            }));
        }

        return NextResponse.json(agents);
    } catch {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const { instanceName, action } = await req.json();

        if (!instanceName || action !== "logout") {
            return NextResponse.json({ error: "Ação inválida ou nome da instância ausente" }, { status: 400 });
        }

        const company = await prisma.companyContext.findUnique({
            where: { userId: session.user.id },
        });

        if (!company) return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });

        // Verify ownership
        const agent = await prisma.agentConfig.findFirst({
            where: { companyId: company.id, instanceName: instanceName }
        });

        if (!agent) return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 });

        let EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
        const EVOLUTION_API_TOKEN = process.env.EVOLUTION_API_TOKEN;

        if (!EVOLUTION_API_URL || !EVOLUTION_API_TOKEN) {
            return NextResponse.json({ error: "API Evolution não configurada" }, { status: 500 });
        }

        EVOLUTION_API_URL = EVOLUTION_API_URL.replace(/\/manager\/?$/, "").replace(/\/$/, "");

        const res = await fetch(`${EVOLUTION_API_URL}/instance/logout/${instanceName}`, {
            method: "DELETE",
            headers: {
                "apikey": EVOLUTION_API_TOKEN
            }
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Falha ao desconectar na API" }, { status: 400 });
        }

        // Update DB
        await prisma.agentConfig.update({
            where: { id: agent.id },
            data: { connectionStatus: "disconnected" }
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const { instanceName } = await req.json();

        if (!instanceName) {
            return NextResponse.json({ error: "Nome da instância é obrigatório" }, { status: 400 });
        }

        const company = await prisma.companyContext.findUnique({
            where: { userId: session.user.id },
            include: { agents: true }
        });

        if (!company) return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });

        // PLAN LIMIT GUARD
        const currentPlan = company.plan || "BASIC";
        const limit = PLAN_LIMITS[currentPlan] || 1;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((company as any).agents.length >= limit) {
            return NextResponse.json(
                { error: `Limite do Plano ${currentPlan} excedido. Você pode ter até ${limit} instâncias.` },
                { status: 403 }
            );
        }

        // EVOLUTION API CREATION (assuming evolution url is in env)
        let EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
        const EVOLUTION_API_TOKEN = process.env.EVOLUTION_API_TOKEN;

        if (!EVOLUTION_API_URL || !EVOLUTION_API_TOKEN) {
            return NextResponse.json({ error: "API Evolution não configurada no servidor" }, { status: 500 });
        }

        // Clean URL to avoid /manager/ trailing paths
        EVOLUTION_API_URL = EVOLUTION_API_URL.replace(/\/manager\/?$/, "").replace(/\/$/, "");

        try {
            const createRes = await fetch(`${EVOLUTION_API_URL}/instance/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": EVOLUTION_API_TOKEN
                },
                body: JSON.stringify({
                    instanceName: instanceName,
                    qrcode: true,
                    integration: "WHATSAPP-BAILEYS"
                })
            });

            if (!createRes.ok) {
                const apiError = await createRes.json();

                let errorMessage = "Erro na Evolution API";
                if (apiError?.response?.message && Array.isArray(apiError.response.message)) {
                    errorMessage = apiError.response.message[0];
                } else if (apiError?.message) {
                    errorMessage = apiError.message;
                } else if (apiError?.error) {
                    errorMessage = apiError.error;
                }

                return NextResponse.json({ error: errorMessage }, { status: 400 });
            }

            const evolutionData = await createRes.json();

            // Configure Webhook using ENV automatically (Standard SaaS Flow)
            const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
            if (n8nWebhookUrl) {
                try {
                    await fetch(`${EVOLUTION_API_URL}/webhook/set/${instanceName}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "apikey": EVOLUTION_API_TOKEN
                        },
                        body: JSON.stringify({
                            webhook: {
                                enabled: true,
                                url: n8nWebhookUrl,
                                byEvents: false,
                                base64: true,
                                events: ["MESSAGES_UPSERT"]
                            }
                        })
                    });
                } catch (webhookError) {
                    console.error("Failed to set webhook for instance", webhookError);
                }
            }

            // Save in Prisma
            const newAgent = await prisma.agentConfig.create({
                data: {
                    companyId: company.id,
                    instanceName: instanceName,
                    active: true,
                    qrcodeString: evolutionData?.qrcode?.base64 || null,
                    connectionStatus: "reading"
                }
            });

            return NextResponse.json(newAgent, { status: 201 });

        } catch (apiError) {
            console.error(apiError);
            return NextResponse.json({ error: "Falha ao conectar na Evolution API" }, { status: 500 });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

        const url = new URL(req.url);
        const name = url.searchParams.get("instanceName");

        if (!name) return NextResponse.json({ error: "Nome da instância é obrigatório" }, { status: 400 });

        const company = await prisma.companyContext.findUnique({
            where: { userId: session.user.id },
        });

        if (!company) return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });

        // Ensure the agent belongs to this company
        const agent = await prisma.agentConfig.findFirst({
            where: { companyId: company.id, instanceName: name }
        });

        if (!agent) return NextResponse.json({ error: "Agente não encontrado ou não pertence a esta empresa" }, { status: 404 });

        // Delete from Evolution API
        let EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
        const EVOLUTION_API_TOKEN = process.env.EVOLUTION_API_TOKEN;

        if (EVOLUTION_API_URL && EVOLUTION_API_TOKEN) {
            EVOLUTION_API_URL = EVOLUTION_API_URL.replace(/\/manager\/?$/, "").replace(/\/$/, "");
            try {
                await fetch(`${EVOLUTION_API_URL}/instance/delete/${name}`, {
                    method: "DELETE",
                    headers: {
                        "apikey": EVOLUTION_API_TOKEN
                    }
                });
            } catch (e) {
                console.warn("Could not delete from Evolution API, proceeding to delete from DB anyway.", e);
            }
        }

        // Delete from Prisma
        await prisma.agentConfig.delete({
            where: { id: agent.id }
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Bot, MessageSquare, Zap, Activity, ArrowRight, CheckCircle2, QrCode } from "lucide-react";

export default async function DashboardHome() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) return null;

    // Busca dados da empresa do usuário
    const company = await prisma.companyContext.findUnique({
        where: { userId: session.user.id },
        include: { agents: true }
    });

    const firstAgent = company?.agents?.[0] || null;

    let connectionStatus = firstAgent?.connectionStatus;

    if (firstAgent?.instanceName) {
        let apiUrl = process.env.EVOLUTION_API_URL;
        const apiToken = process.env.EVOLUTION_API_TOKEN;

        if (apiUrl && apiToken) {
            apiUrl = apiUrl.replace(/\/manager\/?$/, "").replace(/\/$/, "");
            try {
                const res = await fetch(`${apiUrl}/instance/connectionState/${firstAgent.instanceName}`, {
                    headers: { "apikey": apiToken },
                    cache: 'no-store'
                });
                if (res.ok) {
                    const data = await res.json();
                    const state = data?.instance?.state || data?.state;
                    if (state === "open") {
                        connectionStatus = "connected";
                    } else if (state === "close") {
                        connectionStatus = "disconnected";
                    }
                }
            } catch {
                // Mantém o status do banco em caso de erro
            }
        }
    }

    return (
        <div className="relative z-10 p-4 sm:p-8 max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-outfit text-white">
                        Activity Hub
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Acompanhe a performance da sua inteligência artificial e configure o sistema em tempo real.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm font-medium text-emerald-400 tracking-wide uppercase">Sistema Operacional</span>
                </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-[20px] rounded-3xl p-8 relative overflow-hidden border border-white/5">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 opacity-30"></div>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10">
                    <div>
                        <h3 className="text-2xl font-bold text-white font-outfit mb-1">Guia de Inicialização Rápida</h3>
                        <p className="text-gray-400 text-sm">Complete estes passos para ativar totalmente sua IA.</p>
                    </div>
                    <div className="mt-4 lg:mt-0 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                        {connectionStatus === "connected" && company?.basePrompt ? "100% Completo" : company?.basePrompt || connectionStatus === "connected" ? "50% Completo" : "0% Completo"}
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute top-[28px] left-0 w-full h-[2px] bg-white/10 hidden lg:block"></div>
                    <div className={`absolute top-[28px] left-0 h-[2px] bg-gradient-to-r from-emerald-500 to-cyan-500 hidden lg:block shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000 ${connectionStatus === "connected" && company?.basePrompt ? "w-full" : company?.basePrompt || connectionStatus === "connected" ? "w-1/2" : "w-0"
                        }`}></div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                        {/* Step 1: Treinar a IA */}
                        <div className="group relative">
                            <div className="flex lg:flex-col items-center gap-4 lg:gap-0 lg:text-center">
                                {company?.basePrompt ? (
                                    <div className="w-14 h-14 rounded-full bg-black border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center shrink-0 z-10 relative">
                                        <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                                    </div>
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-black border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center shrink-0 z-10 relative animate-pulse">
                                        <Bot className="w-7 h-7 text-cyan-500" />
                                    </div>
                                )}
                                <div className="lg:mt-6 flex flex-col items-start lg:items-center">
                                    <h4 className={`text-lg font-bold transition-colors ${company?.basePrompt ? 'text-gray-300' : 'text-white group-hover:text-cyan-400'}`}>Treinar a Inteligência Artificial</h4>
                                    <p className="text-sm text-gray-500 mt-1 lg:px-4 text-left lg:text-center">Defina o nome da empresa, voz e base de conhecimento na aba Contexto da IA.</p>
                                    {!company?.basePrompt && (
                                        <a href="/dashboard/ai-context" className="mt-4 px-6 py-2 rounded-full bg-cyan-500 text-black text-sm font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.15),_0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:bg-cyan-400 transition-all">
                                            Configurar IA
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Conectar WhatsApp */}
                        <div className="group relative">
                            <div className="flex lg:flex-col items-center gap-4 lg:gap-0 lg:text-center">
                                {connectionStatus === "connected" ? (
                                    <div className="w-14 h-14 rounded-full bg-black border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center shrink-0 z-10 relative">
                                        <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                                    </div>
                                ) : (
                                    <div className={`w-14 h-14 rounded-full bg-black border-2 flex items-center justify-center shrink-0 z-10 relative ${company?.basePrompt ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse' : 'border-white/10'}`}>
                                        <QrCode className={`w-7 h-7 ${company?.basePrompt ? 'text-cyan-500' : 'text-white/40'}`} />
                                    </div>
                                )}
                                <div className="lg:mt-6 flex flex-col items-start lg:items-center">
                                    <h4 className={`text-lg font-bold transition-colors ${connectionStatus === "connected" ? 'text-gray-300' : 'text-white group-hover:text-cyan-400'}`}>Conectar WhatsApp</h4>
                                    <p className="text-sm text-gray-400 mt-1 lg:px-4 text-left lg:text-center">Leia o código QR na aba Conexões para vincular seu número comercial instantaneamente.</p>
                                    {!connectionStatus && (
                                        <a href="/dashboard/connection" className={`mt-4 px-6 py-2 rounded-full text-black text-sm font-bold transition-all ${company?.basePrompt ? 'bg-cyan-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),_0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:bg-cyan-400' : 'bg-gray-500 cursor-not-allowed opacity-50'}`}>
                                            Conectar Agora
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Pronto */}
                        <div className={`group relative transition-opacity ${connectionStatus === "connected" && company?.basePrompt ? 'opacity-100' : 'opacity-40'}`}>
                            <div className="flex lg:flex-col items-center gap-4 lg:gap-0 lg:text-center">
                                <div className={`w-14 h-14 rounded-full bg-black border-2 flex items-center justify-center shrink-0 z-10 relative ${connectionStatus === "connected" && company?.basePrompt ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-white/10'}`}>
                                    <Zap className={connectionStatus === "connected" && company?.basePrompt ? 'text-emerald-500 w-7 h-7' : 'text-white/40 w-7 h-7'} />
                                </div>
                                <div className="lg:mt-6">
                                    <h4 className={`text-lg font-bold ${connectionStatus === "connected" && company?.basePrompt ? 'text-white' : 'text-gray-400'}`}>Inicie as Vendas</h4>
                                    <p className="text-sm text-gray-500 mt-1 lg:px-4 text-left lg:text-center">Sua IA está pronta para engajar com leads e responder automaticamente.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="relative group overflow-hidden bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-6 transition-all duration-300 hover:border-cyan-500/30 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.15)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-cyan-500/20 transition-all"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-900/20 flex items-center justify-center border border-cyan-500/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                <Bot className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Status do Agente</h3>
                        </div>
                        <div>
                            <div className="flex items-end gap-3">
                                <span className="text-3xl font-extrabold text-white tracking-tight">
                                    {connectionStatus === "connected" ? "Online" : "Offline"}
                                </span>
                                <span className="relative flex h-3 w-3 mb-2">
                                    {connectionStatus === "connected" ? (
                                        <>
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                                        </>
                                    ) : (
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    )}
                                </span>
                            </div>
                            <p className={`text-xs mt-2 font-medium ${connectionStatus === "connected" ? 'text-cyan-400' : 'text-red-400'}`}>
                                {connectionStatus === "connected" ? "Operando normalmente" : "Ação de conexão requerida"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative group overflow-hidden bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-6 transition-all duration-300 hover:border-indigo-500/30 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.15)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-all"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-900/20 flex items-center justify-center border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                <MessageSquare className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Conversas</h3>
                        </div>
                        <div>
                            <span className="text-3xl font-extrabold text-white tracking-tight">-</span>
                            <p className="text-xs text-gray-500 mt-2">Métricas em breve (Analytics)</p>
                        </div>
                    </div>
                </div>

                <div className="relative group overflow-hidden bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-6 transition-all duration-300 hover:border-purple-500/30 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.15)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-900/20 flex items-center justify-center border border-purple-500/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                <Zap className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Treinamento IA</h3>
                        </div>
                        <div>
                            <span className="text-3xl font-extrabold text-white tracking-tight">
                                {company?.basePrompt ? "Ativa" : "Pendente"}
                            </span>
                            <p className="text-xs text-purple-400 mt-2">
                                {company?.basePrompt ? "Base de conhecimento definida" : "Configure o prompt base"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative group overflow-hidden bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-6 transition-all duration-300 hover:border-emerald-500/30 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 flex items-center justify-center border border-emerald-500/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                <Activity className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Empresa</h3>
                        </div>
                        <div>
                            <span className="text-xl font-bold text-white truncate max-w-full block">
                                {company?.name || "Não definida"}
                            </span>
                            <p className="text-xs text-gray-500 mt-2">
                                {company?.name ? "Perfil registrado" : "Adicione nas configurações"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/[0.03] backdrop-blur-[20px] rounded-3xl p-8 border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white font-outfit">Logs Recentes do Sistema</h3>
                        <button className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider transition-colors">Ver Todos</button>
                    </div>
                    <div className="space-y-4">
                        {company?.updatedAt && (
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                <div>
                                    <p className="text-sm text-gray-300"><span className="font-semibold text-white">Sistema Atualizado</span>: Contexto de IA ou Perfil foi modificado com sucesso.</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Ultima alteração em: {new Date(company.updatedAt).toLocaleDateString('pt-BR')} às {new Date(company.updatedAt).toLocaleTimeString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                            <div>
                                <p className="text-sm text-gray-300"><span className="font-semibold text-white">Sessão Ativa</span>: Login autenticado com sucesso.</p>
                                <p className="text-xs text-gray-500 mt-1">Sessão atual de: {session.user.name || session.user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl p-[1px] group h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-black to-emerald-500/20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative h-full bg-black rounded-[23px] overflow-hidden p-6 flex flex-col justify-between">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/20 blur-[50px] rounded-full pointer-events-none group-hover:bg-cyan-500/30 transition-all"></div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
                                <Zap className="w-3.5 h-3.5" />
                                Novidade
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Painel Activity Hub</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Acompanhe de perto o fluxo fundamental do seu robô através do novo guia interativo e das métricas em tempo real. Identifique gargalos na mesma tela.
                            </p>
                        </div>
                        <a href="/dashboard/ai-context" className="mt-6 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all flex items-center justify-center gap-2 group-hover:border-cyan-500/30 relative z-10">
                            Explorar Funções
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

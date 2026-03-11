/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Loader2, Smartphone, QrCode, Plus, Trash2 } from "lucide-react";

export default function ConnectionPage() {
    const [agents, setAgents] = useState<any[]>([]);
    const [newInstanceName, setNewInstanceName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const fetchAgents = async () => {
        try {
            const res = await fetch("/api/agent");
            const data = await res.json();
            if (Array.isArray(data)) {
                setAgents(data);
            }
        } catch {
            console.error("Erro ao buscar agentes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch("/api/agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ instanceName: newInstanceName }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: "error", text: data.error || "Erro ao criar instância" });
                return;
            }

            setMessage({ type: "success", text: "Conexão criada com sucesso! O webhook foi vinculado automaticamente." });
            setNewInstanceName("");
            fetchAgents();
        } catch {
            setMessage({ type: "error", text: "Erro ao salvar conexão." });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (instanceName: string) => {
        if (!confirm(`Tem certeza que deseja deletar a instância ${instanceName}?`)) return;

        try {
            const res = await fetch(`/api/agent?instanceName=${instanceName}`, {
                method: "DELETE"
            });

            if (res.ok) {
                fetchAgents();
            } else {
                const data = await res.json();
                alert(data.error || "Erro ao deletar");
            }
        } catch {
            alert("Erro ao deletar");
        }
    };

    const handleLogout = async (instanceName: string) => {
        if (!confirm(`Tem certeza que deseja desconectar o WhatsApp da instância ${instanceName}? Isso exigirá ler o QR Code novamente.`)) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/agent`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ instanceName, action: "logout" })
            });

            if (res.ok) {
                setMessage({ type: "success", text: "WhatsApp desconectado com sucesso!" });
                fetchAgents();
            } else {
                const data = await res.json();
                setMessage({ type: "error", text: data.error || "Erro ao desconectar" });
                setLoading(false);
            }
        } catch {
            setMessage({ type: "error", text: "Erro ao desconectar" });
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-cyan-500 animate-spin"></div>
                    <div className="absolute inset-0 m-auto w-6 h-6 rounded-full border-l-2 border-r-2 border-indigo-500 animate-[spin_1.5s_linear_reverse_infinite]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            {/* Header section with gradient flair */}
            <div className="relative">
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 font-outfit">
                        Conexões WhatsApp
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Gerencie os números de atendimento da sua IA de vendas automatizada.
                    </p>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl font-medium text-sm border backdrop-blur-sm transition-all ${message.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]"}`}>
                    <div className="flex items-center gap-2">
                        {message.type === "success" ? (
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        ) : (
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                        )}
                        {message.text}
                    </div>
                </div>
            )}

            {/* List of existing agents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {agents.map((agent) => (
                    <div key={agent.id} className="relative group overflow-hidden bg-gray-900/60 backdrop-blur-xl border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-300 shadow-xl">
                        {/* Decorative glow */}
                        {agent.connectionStatus === 'connected' && (
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                        )}

                        <div className="relative h-full flex flex-col">
                            {/* Card Header */}
                            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-black/20">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${agent.connectionStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-400'}`}>
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white tracking-wide">{agent.instanceName}</h3>
                                </div>
                                <button onClick={() => handleDelete(agent.instanceName)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" title="Excluir instância">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Card Body */}
                            <div className="p-8 flex-1 flex flex-col items-center justify-center">
                                {agent.connectionStatus === 'connected' ? (
                                    <div className="space-y-5 text-center w-full">
                                        <div className="relative w-28 h-28 mx-auto">
                                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                                            <div className="relative w-full h-full rounded-full bg-gray-900 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                                                <svg className="w-12 h-12 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.115.553 4.148 1.606 5.945L.016 23.984l6.155-1.616A11.968 11.968 0 0012.031 24c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm0 22.015c-1.84 0-3.642-.494-5.215-1.428l-.372-.221-3.873 1.016 1.033-3.774-.243-.388a9.986 9.986 0 01-1.545-5.373C1.816 6.386 6.425 1.777 12.031 1.777c5.606 0 10.215 4.609 10.215 10.215s-4.609 10.023-10.215 10.023zm5.618-7.653c-.308-.154-1.821-.899-2.103-1.002-.282-.103-.488-.154-.693.154-.205.308-.796 1.002-.975 1.207-.179.205-.359.231-.667.077-1.464-.73-2.612-1.439-3.628-3.18-.154-.282-.016-.436.138-.588.138-.138.308-.359.462-.538.154-.18.205-.308.308-.513.103-.205.051-.385-.026-.538-.077-.154-.693-1.671-.949-2.287-.251-.605-.506-.523-.693-.533-.18-.01-.385-.01-.59-.01a1.13 1.13 0 00-.821.385c-.282.308-1.078 1.053-1.078 2.568s1.104 2.978 1.258 3.184c.154.205 2.167 3.308 5.248 4.636 2.067.892 2.766.721 3.278.605.589-.133 1.821-.744 2.078-1.465.257-.721.257-1.341.18-1.465-.077-.123-.282-.2-.59-.354z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-emerald-400">Canal Conectado</p>
                                            <p className="text-sm text-gray-400 mt-1">A IA já está operando ativamente neste número.</p>
                                        </div>
                                        <button
                                            onClick={() => handleLogout(agent.instanceName)}
                                            className="mt-6 w-full px-5 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm font-semibold rounded-xl transition-all duration-200 border border-red-500/20 hover:border-red-500/40"
                                        >
                                            Desconectar Aparelho
                                        </button>
                                    </div>
                                ) : agent.qrcodeString ? (
                                    <div className="space-y-6 text-center w-full">
                                        <div className="relative inline-block bg-white p-3 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                                            <img src={agent.qrcodeString} alt="QR Code" className="w-56 h-56" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white text-lg">Aguardando Conexão</p>
                                            <p className="text-sm text-gray-400 mt-1 max-w-[260px] mx-auto leading-relaxed">
                                                Abra o WhatsApp no celular, vá em Aparelhos Conectados e leia o QR Code.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 text-center w-full">
                                        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                                            <QrCode className="w-8 h-8 text-gray-500" />
                                        </div>
                                        <p className="text-sm text-gray-400">QR Code indisponível.</p>
                                    </div>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className="px-6 py-4 bg-black/40 border-t border-white/5 w-full flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex h-2.5 w-2.5">
                                        {agent.connectionStatus === 'connected' ? (
                                            <>
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                            </>
                                        ) : (
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                                        )}
                                    </div>
                                    <span className="text-gray-400">Status API:</span>
                                    <span className={`font-semibold ${agent.connectionStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {agent.connectionStatus === 'connected' ? 'Ativo' : 'Pendente'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => fetchAgents()}
                                    className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs font-medium text-white flex items-center gap-1.5 transition-all"
                                >
                                    Atualizar <Loader2 className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : 'text-gray-400'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {agents.length === 0 && (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Smartphone className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Nenhum canal ativo</h3>
                        <p className="text-gray-400 text-center max-w-sm">
                            Você ainda não possui nenhum número de WhatsApp vinculado à nossa inteligência artificial.
                        </p>
                    </div>
                )}
            </div>

            {/* Create new agent form */}
            <form onSubmit={handleCreate} className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl shadow-2xl">
                <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="relative z-10 px-8 py-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
                            <Plus className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Vincular Novo Aparelho</h3>
                            <p className="text-sm text-gray-400 mt-1">Gere um QR Code para registrar o seu novo assistente.</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 p-8">
                    <div className="flex flex-col md:flex-row gap-5 items-end">
                        <div className="flex-1 w-full space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Identificação Interna (Nome)</label>
                            <input
                                type="text"
                                value={newInstanceName}
                                onChange={(e) => setNewInstanceName(e.target.value)}
                                required
                                className="block w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner"
                                placeholder="ex: suporte_vendas_01"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving || !newInstanceName}
                            className="h-[52px] px-8 border border-transparent rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] text-sm font-bold text-black bg-cyan-400 hover:bg-cyan-300 focus:ring-4 focus:ring-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 w-full md:w-auto flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Gerando Token...
                                </>
                            ) : (
                                <>
                                    Continuar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

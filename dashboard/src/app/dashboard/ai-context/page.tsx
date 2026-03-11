"use client";

import { useEffect, useState, useRef } from "react";
import { Save, Loader2, Bot, FileText, ShoppingBag, Upload, Trash2, FileUp } from "lucide-react";

export default function AiContextPage() {
    const [name, setName] = useState("");
    const [basePrompt, setBasePrompt] = useState("");
    const [products, setProducts] = useState("");
    const [documents, setDocuments] = useState<{ name: string, content: string }[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch("/api/company")
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setName(data.name || "");
                    setBasePrompt(data.basePrompt || "");
                    setProducts(typeof data.products === "string" ? data.products : JSON.stringify(data.products, null, 2) || "");
                    setDocuments(Array.isArray(data.documents) ? data.documents : []);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                if (content) {
                    setDocuments(prev => [...prev, { name: file.name, content }]);
                }
            };
            reader.readAsText(file);
        });

        // reset input
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveDocument = (index: number) => {
        setDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch("/api/company", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, basePrompt, products, documents }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: "error", text: data.message || "Erro ao salvar contexto" });
                return;
            }

            setMessage({ type: "success", text: "Contexto salvo com sucesso!" });
        } catch {
            setMessage({ type: "error", text: "Erro ao salvar as configurações." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin"></div>
                    <div className="absolute inset-0 m-auto w-6 h-6 rounded-full border-l-2 border-r-2 border-cyan-500 animate-[spin_1.5s_linear_reverse_infinite]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            <div className="relative">
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 font-outfit">
                        Contexto da Inteligência Artificial
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Gere a inteligência do seu assistente ensinando o modelo de negócio, produtos e regras de atendimento.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {message.text && (
                    <div className={`p-4 rounded-xl font-medium text-sm border backdrop-blur-sm transition-all ${message.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]"}`}>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                            {message.text}
                        </div>
                    </div>
                )}

                <div className="relative group bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-cyan-500/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-cyan-500/10 transition-all"></div>
                    <div className="relative z-10 px-8 py-6 border-b border-white/5 flex items-center gap-4 bg-white/[0.02]">
                        <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                            <Bot className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wide font-outfit">Identidade do Agente</h3>
                    </div>
                    <div className="relative z-10 p-8 space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1">
                                Nome da Empresa / Projeto
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full bg-black/50 border border-white/10 rounded-xl py-3.5 px-5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all shadow-inner"
                                placeholder="Ex: IcaroDev Soluções"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-1 ml-1 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-cyan-500" />
                                Prompt Base (Regras e Tom de Voz)
                            </label>
                            <p className="text-xs text-gray-500 mb-3 ml-1">Instruções rigorosas sobre como a IA deve se comportar durante o atendimento do whatsapp.</p>
                            <textarea
                                value={basePrompt}
                                onChange={(e) => setBasePrompt(e.target.value)}
                                rows={6}
                                className="block w-full bg-black/50 border border-white/10 rounded-xl shadow-inner py-4 px-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 font-mono text-sm leading-relaxed transition-all resize-y"
                                placeholder="Você é um assistente virtual da nossa loja. Responda de forma educada, curta e direta. Sempre use emojis. Nunca invente preços que não estão na lista."
                            />
                        </div>
                    </div>
                </div>

                <div className="relative group bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-indigo-500/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-500/10 transition-all"></div>
                    <div className="relative z-10 px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                <ShoppingBag className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-wide font-outfit">Aceleração de Conhecimento (Base Simples)</h3>
                        </div>
                    </div>
                    <div className="relative z-10 p-8">
                        <p className="text-sm text-gray-400 mb-4 ml-1">
                            Cole aqui a lista de produtos, cardápios de preços, horários de funcionamento e FAQ rápido (Perguntas Frequentes).
                        </p>
                        <textarea
                            value={products}
                            onChange={(e) => setProducts(e.target.value)}
                            rows={8}
                            className="block w-full bg-black/50 border border-white/10 rounded-xl shadow-inner py-4 px-5 text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 font-mono text-sm leading-relaxed transition-all resize-y"
                            placeholder={'1. Plano Avançado: R$ 97/mês\n2. Plano Expert: R$ 297/mês\n\n- Horário de atendimento: 08:00 as 18:00\n- Forma de pagamento aceitas: PIX, Boleto ou Cartão.'}
                        />
                    </div>
                </div>

                <div className="relative group bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-emerald-500/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-all"></div>
                    <div className="relative z-10 px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <FileUp className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-wide font-outfit">Documentos Avançados (Arquivos longos)</h3>
                        </div>
                    </div>
                    <div className="relative z-10 p-8 space-y-5">
                        <p className="text-sm text-gray-400 mb-4">
                            Sua empresa possui planilhas, PDFs transcritos ou grandes blocos de texto? Faça upload em <span className="text-gray-200 font-semibold bg-white/5 px-2 py-0.5 rounded">.txt, .md, ou .csv</span>. Nosso sistema extrai os tokens e alimenta a memória da IA.
                        </p>

                        <div className="flex gap-4 items-center mt-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 text-sm font-semibold text-white rounded-xl transition-all border border-white/10"
                            >
                                <Upload className="w-4 h-4" />
                                Importar Arquivos
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".txt,.md,.csv"
                                onChange={handleFileUpload}
                                multiple
                            />
                        </div>

                        {documents.length > 0 && (
                            <div className="mt-6 space-y-3">
                                {documents.map((doc, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-3 truncate">
                                            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                                                <FileText className="w-4 h-4 shrink-0" />
                                            </div>
                                            <span className="text-sm text-gray-200 truncate font-semibold tracking-wide">{doc.name}</span>
                                            <span className="text-xs text-gray-500 shrink-0 font-medium bg-white/5 px-2 py-0.5 rounded-md">{doc.content.length} bytes processados</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDocument(idx)}
                                            className="text-gray-500 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-all"
                                            title="Remover documento"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4 pb-8">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(33,150,243,0.2)] text-base font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 transition-all disabled:opacity-50 hover:scale-[1.02]"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {saving ? "Salvando Nuvem..." : "Gabaritar e Salvar IA"}
                    </button>
                </div>
            </form>
        </div>
    );
}

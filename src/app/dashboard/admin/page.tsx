"use client";

import { useState, useEffect } from "react";
import {
    Save,
    Plus,
    Trash2,
    CheckCircle2,
    Loader2,
    ArrowLeft,
    Users,
    TrendingUp,
    DollarSign,
    CreditCard,
    Settings2,
    PieChart,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "overview" | "plans" | "customers";

interface Stats {
    totalUsers: number;
    estimatedRevenue: number;
    activeUsers: number;
    conversions: number;
}

interface Plan {
    id: string;
    name: string;
    description: string;
    price: string;
    features: string[];
    popular: boolean;
    checkoutUrl: string;
    active: boolean;
}

interface Customer {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    company?: {
        plan: string;
    };
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [stats, setStats] = useState<Stats | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, plansRes] = await Promise.all([
                fetch("/api/admin/stats"),
                fetch("/api/admin/plans")
            ]);

            const statsData = await statsRes.json();
            const plansData = await plansRes.json();

            setStats(statsData.stats);
            setCustomers(statsData.latestUsers);
            setPlans(plansData);
        } catch (err) {
            console.error("Error fetching admin data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePlan = async (plan: Plan) => {
        setSaving(plan.id);
        try {
            const res = await fetch("/api/admin/plans", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(plan),
            });
            if (!res.ok) throw new Error("Erro ao salvar");
            setTimeout(() => setSaving(null), 1000);
        } catch (err) {
            alert("Erro ao salvar");
            setSaving(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Voltar
                    </Link>
                    <h1 className="text-4xl font-black text-white tracking-tight">Painel do Dono</h1>
                    <p className="text-gray-400">Visão geral do faturamento e controle de assinaturas.</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    {[
                        { id: "overview", label: "Visão Geral", icon: PieChart },
                        { id: "plans", label: "Planos", icon: Settings2 },
                        { id: "customers", label: "Clientes", icon: Users }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-cyan-500 text-black shadow-lg'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: "Faturamento Est.", value: `R$ ${stats?.estimatedRevenue?.toFixed(2)}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                                { label: "Total Usuários", value: stats?.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
                                { label: "Assinaturas Ativas", value: stats?.conversions, icon: CreditCard, color: "text-purple-400", bg: "bg-purple-500/10" },
                                { label: "Taxa de Retenção", value: "98%", icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10" }
                            ].map((s, i) => (
                                <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-3xl relative overflow-hidden group">
                                    <div className={`absolute top-0 right-0 p-3 ${s.bg} rounded-bl-3xl ${s.color}`}>
                                        <s.icon className="w-6 h-6" />
                                    </div>
                                    <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">{s.label}</p>
                                    <h3 className="text-3xl font-black text-white mt-1">{s.value}</h3>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity & Customers */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-black/40 border border-white/5 rounded-3xl p-6">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-cyan-400" /> Clientes Recentes
                                </h3>
                                <div className="space-y-4">
                                    {customers.map((c) => (
                                        <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-cyan-500/30 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-900 to-indigo-900 flex items-center justify-center font-bold text-white">
                                                    {c.name?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{c.name}</p>
                                                    <p className="text-xs text-gray-500">{c.email}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-black px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 uppercase tracking-tighter">
                                                    {c.company?.plan || "GRÁTIS"}
                                                </span>
                                                <p className="text-[10px] text-gray-600 mt-1 uppercase italic">
                                                    {new Date(c.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 flex flex-col justify-center items-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center">
                                    <TrendingUp className="w-8 h-8 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Pronto para escalar?</h3>
                                    <p className="text-gray-500 max-w-xs mt-2">Novas ferramentas de marketing e cupons serão adicionadas em breve.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "plans" && (
                    <motion.div
                        key="plans"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 gap-8"
                    >
                        {plans.map((plan) => (
                            <div key={plan.id} className="bg-black/40 border border-white/5 rounded-3xl p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Nome</label>
                                        <input
                                            value={plan.name}
                                            onChange={(e) => setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, name: e.target.value } : p))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Preço (R$)</label>
                                        <input
                                            value={plan.price}
                                            onChange={(e) => setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, price: e.target.value } : p))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Checkout URL</label>
                                        <input
                                            value={plan.checkoutUrl}
                                            onChange={(e) => setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, checkoutUrl: e.target.value } : p))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div className="flex items-end gap-6 pb-2">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={plan.popular}
                                                onChange={(e) => setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, popular: e.target.checked } : p))}
                                                className="rounded border-white/10 text-cyan-500"
                                            />
                                            <span className="text-sm text-gray-400 group-hover:text-white">Popular</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={plan.active}
                                                onChange={(e) => setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, active: e.target.checked } : p))}
                                                className="rounded border-white/10 text-cyan-500"
                                            />
                                            <span className="text-sm text-gray-400 group-hover:text-white">Ativo</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleUpdatePlan(plan)}
                                        className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${saving === plan.id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500 text-black'
                                            }`}
                                    >
                                        {saving === plan.id ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                        {saving === plan.id ? "Salvo" : "Salvar"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {activeTab === "customers" && (
                    <motion.div
                        key="customers"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-black/40 border border-white/5 rounded-3xl overflow-hidden"
                    >
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cliente</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Plano Atual</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cadastro</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {customers.map((c) => (
                                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white">{c.name}</td>
                                        <td className="px-6 py-4 text-gray-400">{c.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-lg bg-white/5 text-[10px] font-black text-cyan-400 border border-cyan-500/20">
                                                {c.company?.plan || "GRÁTIS"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

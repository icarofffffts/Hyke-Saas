'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Bot, Zap, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-500" />
            A agência líder em automações com IA
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 font-display text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Escale sua operação com{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Inteligência Artificial
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 sm:text-xl"
          >
            A Hyke Solutions se destaca como a referência no mercado, oferecendo uma ampla variedade de soluções de automação com IA para otimizar processos e reduzir custos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="#services"
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-indigo-500 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-indigo-600 sm:w-auto"
            >
              Conferir soluções
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="https://wa.me/5531982382635?text=Ol%C3%A1%2C%20queria%20saber%20mais%20sobre%20os%20planos%20da%20Hyke%20Solutions!" target="_blank"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
            >
              Falar com consultor
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-zinc-500 sm:gap-12"
          >
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-400" />
              <span>Agentes Autônomos</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              <span>Integrações Rápidas</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>Segurança de Dados</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

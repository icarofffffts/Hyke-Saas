'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { MessageSquare, Workflow, BrainCircuit, ArrowRight } from 'lucide-react';

const services = [
  {
    id: 'atendimento',
    title: 'Automação de Atendimento',
    description: 'Chatbots inteligentes com IA que conversam como humanos, qualificam leads e agendam reuniões 24/7.',
    icon: MessageSquare,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  {
    id: 'integracoes',
    title: 'Integração de Sistemas',
    description: 'Conectamos suas ferramentas (CRM, ERP, WhatsApp) para eliminar tarefas manuais e repetitivas.',
    icon: Workflow,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
    border: 'border-indigo-400/20',
  },
  {
    id: 'consultoria',
    title: 'Consultoria em IA',
    description: 'Analisamos seus processos atuais e desenhamos um plano de implementação de IA sob medida para sua empresa.',
    icon: BrainCircuit,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Nossas Soluções
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-zinc-400"
          >
            Veja os serviços disponíveis para escalar o seu negócio.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${service.border} bg-zinc-900/50 p-8 transition-all hover:bg-zinc-900`}
              >
                <div>
                  <div className={`mb-6 inline-flex rounded-xl ${service.bg} p-4`}>
                    <Icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                  <h3 className="mb-3 font-display text-xl font-bold text-white">
                    {service.title}
                  </h3>
                  <p className="mb-8 text-zinc-400">
                    {service.description}
                  </p>
                </div>

                <Link
                  href={`#contact`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-indigo-400"
                >
                  Saber mais
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

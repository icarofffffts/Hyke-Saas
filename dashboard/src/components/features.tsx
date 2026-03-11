'use client';

import { motion } from 'motion/react';
import { Rocket, HeadphonesIcon, ShieldCheck } from 'lucide-react';

const features = [
  {
    title: 'Implementação ágil',
    description: 'Tenha seus agentes de IA rodando e gerando resultados em poucos dias após o fechamento.',
    icon: Rocket,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    title: 'Suporte eficiente',
    description: 'Em caso de dúvidas ou ajustes, entre em contato com o nosso suporte dedicado via WhatsApp.',
    icon: HeadphonesIcon,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
  },
  {
    title: 'Soluções seguras',
    description: 'Seus dados e os dos seus clientes são criptografados e processados com os mais altos padrões de segurança.',
    icon: ShieldCheck,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
];

export default function Features() {
  return (
    <section id="features" className="border-y border-white/5 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.bg}`}>
                  <Icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="mb-4 font-display text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

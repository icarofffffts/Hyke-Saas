'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Como posso contratar uma automação?',
    answer: 'Para contratar, basta entrar em contato com nossa equipe clicando em "Falar com Especialista". Faremos uma reunião de diagnóstico gratuita para entender suas necessidades.',
  },
  {
    question: 'Qual o prazo de implementação?',
    answer: 'O prazo varia de acordo com a complexidade do projeto, mas a maioria dos nossos agentes de IA e automações são implementados entre 7 e 14 dias úteis.',
  },
  {
    question: 'Como funciona o suporte pós-venda?',
    answer: 'Nosso suporte está disponível via WhatsApp e e-mail. Oferecemos pacotes de manutenção mensal para garantir que sua IA continue aprendendo e evoluindo com o seu negócio.',
  },
  {
    question: 'Preciso ter conhecimento técnico?',
    answer: 'Não! Nós cuidamos de toda a parte técnica. Entregamos a solução pronta e treinamos sua equipe para utilizá-la da melhor forma.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-zinc-950 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Perguntas Frequentes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-zinc-400"
          >
            Veja as perguntas mais comuns e suas respostas.
          </motion.p>
        </div>

        <div className="mx-auto max-w-3xl">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4 overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/30"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-display text-lg font-medium text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-zinc-400">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

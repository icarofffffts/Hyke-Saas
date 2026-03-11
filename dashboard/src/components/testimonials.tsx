'use client';

import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Ricardo Oliveira',
    role: 'CEO, Logix Logística',
    content: 'A Hyke Solutions revolucionou nosso atendimento no WhatsApp. Em apenas 3 meses, reduzimos o tempo médio de resposta de 15 minutos para instantâneo, resultando em um aumento de 35% na conversão de novos contratos.',
    rating: 5,
  },
  {
    name: 'Carolina Mendes',
    role: 'Diretora Comercial, VarejoPlus',
    content: 'O agente de IA da Hyke é impressionante. Ele não apenas atende, mas qualifica os leads e agenda reuniões automaticamente. Dobramos nossa produtividade sem precisar aumentar a equipe de vendas.',
    rating: 5,
  },
  {
    name: 'Bruno Mantovani',
    role: 'Founder, SaaS Evolution',
    content: 'Implementar a automação da Hyke foi o melhor investimento que fizemos este ano. O ROI foi de 4x logo no primeiro mês devido à recuperação de carrinhos e suporte 24/7 humanizado.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            O que nossos clientes dizem
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-zinc-400"
          >
            Veja o feedback de quem já otimizou sua operação com a gente.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-white/5 bg-zinc-900/30 p-8"
            >
              <div className="mb-6 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-8 text-zinc-300 italic">&quot;{testimonial.content}&quot;</p>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-lg font-bold text-indigo-400">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-zinc-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

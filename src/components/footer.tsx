'use client';

import Link from 'next/link';
import { Instagram, DiscIcon as Discord, Facebook, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-zinc-950/30 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 font-display font-bold text-white">
                H
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Hyke Solutions
              </span>
            </Link>
            <p className="mb-6 max-w-sm text-sm text-zinc-400">
              A agência líder em automação com Inteligência Artificial. Transformamos processos manuais em sistemas inteligentes e eficientes.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://instagram.com/__icarofernandes" target="_blank" className="text-zinc-400 hover:text-indigo-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://discord.gg/hykesolutions" target="_blank" className="text-zinc-400 hover:text-indigo-400 transition-colors">
                <Discord className="h-5 w-5" />
              </Link>
              <Link href="https://facebook.com" target="_blank" className="text-zinc-400 hover:text-indigo-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://whatsapp.com" target="_blank" className="text-zinc-400 hover:text-indigo-400 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display font-bold text-white">Acesse</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Página Inicial</Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-white transition-colors">Nossos Serviços</Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-white transition-colors">Termos de Serviço</Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-white transition-colors">Blog</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display font-bold text-white">Contato</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>contato@hykesolutions.com.br</li>
              <li>+55 (31) 98238-2635</li>
              <li>Santa Luzia, MG - Brasil</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 text-center text-sm text-zinc-500">
          <p>Copyright © {new Date().getFullYear()} Hyke Solutions. Todos os direitos reservados.</p>
          <p className="mt-2 text-xs">CNPJ: 56.400.433/0001-10</p>
        </div>
      </div>
    </footer>
  );
}

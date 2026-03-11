'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, MessageCircle, Instagram, DiscIcon as Discord, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 font-display font-bold text-white">
                H
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Hyke Solutions
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#services" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Serviços
            </Link>
            <Link href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Diferenciais
            </Link>
            <Link href="#faq" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              FAQ
            </Link>
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <Link href="https://instagram.com" target="_blank" className="text-zinc-400 hover:text-indigo-400 transition-colors">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="https://discord.com" target="_blank" className="text-zinc-400 hover:text-indigo-400 transition-colors">
                <Discord className="h-4 w-4" />
              </Link>
            </div>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              <User className="h-4 w-4" />
              <span>Portal do Cliente</span>
            </Link>
            <Link href="#contact" className="flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span>Falar com Especialista</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-zinc-400 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-zinc-950"
          >
            <div className="space-y-1 px-4 pb-3 pt-2">
              <Link
                href="#services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                Serviços
              </Link>
              <Link
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                Diferenciais
              </Link>
              <Link
                href="#faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
              >
                FAQ
              </Link>
              <div className="mt-4 border-t border-white/5 pt-4 pb-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
                >
                  <User className="h-5 w-5" />
                  Portal do Cliente
                </Link>
                <Link
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 rounded-md bg-indigo-500 px-3 py-2 text-base font-medium text-white hover:bg-indigo-600"
                >
                  <MessageCircle className="h-5 w-5" />
                  Falar com Especialista
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

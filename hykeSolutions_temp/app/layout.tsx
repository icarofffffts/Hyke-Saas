import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Hyke Solutions | Automações com IA',
  description: 'A agência líder em automação com Inteligência Artificial, chatbots, integração de sistemas e consultoria em IA para escalar o seu negócio.',
  keywords: [
    'automação com IA',
    'chatbots',
    'integração de sistemas',
    'consultoria em IA',
    'inteligência artificial',
    'agência de IA',
    'automação de processos',
    'Hyke Solutions'
  ],
  authors: [{ name: 'Hyke Solutions' }],
  creator: 'Hyke Solutions',
  publisher: 'Hyke Solutions',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Hyke Solutions | Automações com IA',
    description: 'A agência líder em automação com Inteligência Artificial, chatbots, integração de sistemas e consultoria em IA para escalar o seu negócio.',
    url: 'https://hykesolutions.com.br',
    siteName: 'Hyke Solutions',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hyke Solutions | Automações com IA',
    description: 'A agência líder em automação com Inteligência Artificial, chatbots, integração de sistemas e consultoria em IA para escalar o seu negócio.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import ChatWidget from '@/components/ChatWidget';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className="bg-zinc-950 text-zinc-50 font-sans antialiased selection:bg-indigo-500/30" suppressHydrationWarning>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}

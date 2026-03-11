import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Hyke Solutions - Gestão de Agentes de IA",
  description: "Plataforma SaaS para gerenciar e treinar agentes inteligentes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body
        className="bg-zinc-950 text-zinc-50 font-sans antialiased selection:bg-indigo-500/30"
      >
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[60px]" />
          <div className="absolute top-1/2 -left-40 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[60px]" />
          <div className="absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[60px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.10] mix-blend-overlay" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Providers>{children}</Providers>
          <ChatWidget />
        </div>
      </body>
    </html>
  );
}

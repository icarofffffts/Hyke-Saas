# ⚡ Hyke - Multi-Agent AI SaaS Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![n8n](https://img.shields.io/badge/n8n-Automation-FF6D5B?style=flat-square&logo=n8n)](https://n8n.io/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe)](https://stripe.com/)

**Hyke** é uma plataforma SaaS robusta para gestão e orquestração de Agentes de Inteligência Artificial multitenant. Permite que empresas gerenciem atendentes automatizados via WhatsApp, integrando fluxos de IA complexos com uma interface de gestão administrativa premium.

## ✨ Principais Funcionalidades

- 🏢 **Multi-Tenancy**: Sistema isolado para múltiplos clientes/empresas.
- 🤖 **Gestão de Agentes**: Controle centralizado de instâncias e prompts base.
- 💳 **Monetização**: Integração nativa com Stripe e Mercado Pago para planos de assinatura.
- 📱 **WhatsApp Integration**: Conectividade via Evolution API para agentes interativos.
- 🧠 **Smart Context**: Injeção de documentos e catálogos de produtos no contexto da IA.

## 🚀 Tecnologias

- **Core**: Next.js 16 (React 19), TypeScript.
- **Database**: PostgreSQL com Prisma ORM.
- **Auth**: NextAuth.js.
- **AI Engine**: n8n + Google Gemini/OpenAI.
- **Infrastructure**: Docker & Docker Compose.

## 🛠️ Instalação e Execução

Para rodar o ecossistema Hyke localmente:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/icarofffffts/Hyke-Saas.git
   cd Hyke-Saas
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o banco de dados:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Inicie o projeto:**
   ```bash
   npm run dev
   ```

5. **Workflows**: Importe os arquivos JSON da pasta [/workflows](./workflows) no seu n8n.

## 📂 Estrutura do Repositório

- **[/src](./src)**: Código fonte da aplicação principal (Next.js 16).
- **[/workflows](./workflows)**: Blueprints de automação n8n.
- **[/legacy](./legacy)**: Versões anteriores e arquivos temporários de desenvolvimento.

---
Desenvolvido por [Icaro](https://github.com/icarofffffts)

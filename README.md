# Hyke Dashboard

Este é o painel administrativo da plataforma **Hyke**. Construído com o que há de mais moderno no ecossistema Web.

## 🛠️ Tecnologias
- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **Prisma ORM**
- **NextAuth.js** (Autenticação)

## 📦 Instalação

1. Entre na pasta do dashboard:
   ```bash
   cd dashboard
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Inicie o projeto:
   ```bash
   npm run dev
   ```

## ⚙️ Variáveis de Ambiente
Consulte o arquivo [.env.example](.env.example) para configurar as chaves de API necessárias (Stripe, Mercado Pago, DB, etc).

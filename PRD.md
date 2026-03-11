# 📖 Product Requirements Document (PRD) - Hyke

## 1. Visão Geral
O **Hyke** é uma solução completa de "AI as a Service" (AIaaS). Ele resolve a complexidade de configurar, gerenciar e faturar agentes de IA para empresas. A plataforma serve como uma camada de interface amigável sobre infraestruturas de automação (n8n) e comunicação (Evolution API).

## 2. Personas e Casos de Uso
- **Administrador (Hyke)**: Gere planos, usuários e monitora a integridade das instâncias.
- **Empresário (Tenant)**: Configura o "tom de voz" do seu agente, sobe manuais de produtos e assina planos.
- **Cliente Final**: Interage com uma IA treinada e contextualizada via WhatsApp.

## 3. Arquitetura do Sistema

### 3.1 Componentes
- **Dashboard API**: Backend em Next.js lidando com lógica de negócios e persistência.
- **Prisma Schema**: Modelagem relacional para usuários, empresas (CompanyContext) e configurações de agentes (AgentConfig).
- **Automation Node (n8n)**: Recebe webhooks da Evolution API, consulta o banco do Hyke para contexto e executa a lógica da LLM.

### 3.2 Modelo de Dados (Multi-tenant)
Cada usuário (`User`) é vinculado a um contexto de empresa (`CompanyContext`). O contexto contém o `basePrompt` e referências a arquivos de conhecimento. Múltiplos agentes (`AgentConfig`) podem ser criados por empresa (baseado no plano).

## 4. Integrações Críticas
- **Evolution API**: Gateway de mensagens para WhatsApp.
- **Stripe/Mercado Pago**: Processamento de pagamentos recorrentes e webhooks de assinatura.
- **Google Gemini**: Motor de IA principal para processamento de linguagem natural.

## 5. Roadmap Técnico
- [ ] Implementar sistema de "Créditos de Mensagem".
- [ ] Suporte a múltiplos provedores de LLM (Claude/OpenAI).
- [ ] Dashboard de analytics de conversas.

---
*Documentação técnica confidencial - Arx Solutions*

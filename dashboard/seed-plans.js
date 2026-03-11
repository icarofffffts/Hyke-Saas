const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const plans = [
        {
            name: 'Grátis',
            description: 'Experimente o poder da IA no seu negócio sem custos.',
            price: '0,00',
            features: [
                '1 Agente de IA',
                'Teste Grátis por 3 dias',
                'Apenas WhatsApp',
                'Suporte via Comunidade'
            ],
            popular: false,
            checkoutUrl: '',
            active: true,
            sortOrder: 0,
        },
        {
            name: 'Starter',
            description: 'Perfeito para quem está validando seu primeiro funil com IA.',
            price: '35,99',
            features: [
                'Até 2 Agentes de IA',
                'Até 2.500 mensagens/mês',
                'IA treinada com Textos Básicos',
                'WhatsApp e Instagram',
                'Suporte via email'
            ],
            popular: true,
            checkoutUrl: 'https://mpago.la/338BjZb',
            active: true,
            sortOrder: 1,
        },
        {
            name: 'Pro',
            description: 'O plano ideal para clínicas, agências e negócios em crescimento.',
            price: '125,99',
            features: [
                'Até 3 Agentes de IA simultâneos',
                'Mensagens Ilimitadas',
                'Treinamento avançado com envio de PDFs',
                'Omnichannel (WhatsApp + Instagram)',
                'Suporte prioritário via WhatsApp'
            ],
            popular: false,
            checkoutUrl: 'https://mpago.la/121ZVff',
            active: true,
            sortOrder: 2,
        },
        {
            name: 'Enterprise',
            description: 'Solução dedicada full-stack para grandes volumes de atendimento.',
            price: '589,99',
            features: [
                'Agentes de IA Ilimitados',
                'Integração de Catálogos Automática',
                'Omnichannel Total (WhatsApp, Insta, Telegram, Site)',
                'Dashboard White-label (Sua Marca)',
                'Gerente de conta exclusivo'
            ],
            popular: false,
            checkoutUrl: 'https://mpago.la/2DqHZA8', // Enterprise usually requires contact, but keeping it active
            active: true,
            sortOrder: 3,
        }
    ];

    console.log('Seeding plans...');

    for (const plan of plans) {
        await prisma.subscriptionPlan.upsert({
            where: { name: plan.name },
            update: plan,
            create: plan,
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

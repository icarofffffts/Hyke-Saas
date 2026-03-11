const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning database...');
    await prisma.subscriptionPlan.deleteMany({});

    const plans = [
        {
            name: 'Starter',
            description: 'Para autônomos e pequenos negócios iniciando com automação.',
            price: '35,99',
            features: [
                '1 Agente de IA',
                'Até 1.000 mensagens/mês',
                'IA treinada com Textos Básicos',
                'Apenas WhatsApp',
                'Suporte via email'
            ],
            popular: true,
            checkoutUrl: 'https://mpago.la/338BJZb',
            active: true,
        },
        {
            name: 'Pro',
            description: 'O plano ideal para clínicas, agências e negócios em crescimento.',
            price: '125,99',
            features: [
                'Até 3 Agentes de IA simultâneamente',
                'Mensagens Ilimitadas',
                'Treinamento avançado com envio de PDFs',
                'Omnichannel (WhatsApp + Instagram)',
                'Suporte prioritário via WhatsApp'
            ],
            popular: false,
            checkoutUrl: 'https://mpago.la/121ZVff',
            active: true,
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
            checkoutUrl: '#',
            active: true,
        }
    ];

    console.log('Seeding plans...');
    for (const plan of plans) {
        await prisma.subscriptionPlan.create({
            data: plan
        });
    }

    console.log('Done!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

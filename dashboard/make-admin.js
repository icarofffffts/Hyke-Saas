const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error('Por favor, informe o email do usuário: node make-admin.js email@exemplo.com');
        process.exit(1);
    }

    const user = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
    });

    console.log(`Usuário ${user.email} promovido a ADMIN com sucesso!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmin() {
    try {
        console.log("Iniciando promoção de usuários...");
        const users = await prisma.user.updateMany({
            data: {
                role: 'ADMIN' // Usa o Enum do schema
            }
        });
        console.log(`Sucesso! ${users.count} usuário(s) promovido(s) para ADMIN.`);
    } catch (e) {
        // Fallback para caso o Enum cause conflito de tipagem antiga vs nova
        console.log("Erro com o Prisma Client. Fazendo via SQL puro...", e.message);
        try {
            await prisma.$executeRawUnsafe(`UPDATE "User" SET role = 'ADMIN'`);
            console.log("Sucesso! Usuários atualizados via query bruta.");
        } catch (e2) {
            console.log("Erro na query bruta:", e2.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}

makeAdmin();

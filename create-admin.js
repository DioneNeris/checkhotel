const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const connectionString = process.env.DATABASE_URL;

async function main() {
  if (!connectionString) {
    console.error("ERRO: DATABASE_URL não encontrada no ambiente.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const email = process.argv[2] || 'admin@checkhotel.com';
  const password = process.argv[3] || 'admin123';
  const name = process.argv[4] || 'Gerente Admin';

  console.log(`Criando ou atualizando usuário administrador: ${email}`);

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        name,
        role: 'ADMIN',
      },
      create: {
        email,
        name,
        passwordHash,
        role: 'ADMIN',
      },
    });

    console.log(`✅ Sucesso! Admin criado/atualizado com sucesso.`);
    console.log(`👉 Email: ${admin.email}`);
    console.log(`👉 Senha: Foi encriptada e salva com segurança.`);
  } catch (error) {
    console.error("❌ ERRO ao criar admin no banco:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);

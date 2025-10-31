// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@fototeca.local';
  const password = 'Admin123!';
  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN', isActive: true, passwordHash: hash },
    create: {
      email,
      name: 'Admin',
      role: 'ADMIN',
      isActive: true,
      passwordHash: hash,
    },
  });

  console.log('Seed admin:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

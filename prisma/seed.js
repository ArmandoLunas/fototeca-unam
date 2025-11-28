// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

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

  // 1. Create Categories
  // These categories are just for testing purposes
  const sports = await prisma.category.upsert({
    where: { name: 'Deportes' },
    update: {},
    create: { name: 'Deportes' },
  });

  const soccer = await prisma.category.upsert({
    where: { name: 'Fútbol' },
    update: {},
    create: { name: 'Fútbol', parentId: sports.id },
  });

  const rules = await prisma.category.upsert({
    where: { name: 'Reglamentos' },
    update: {},
    create: { name: 'Reglamentos' },
  });

  // 2. Create Resources
  // These resources are just for testing purposes
  // Using upsert to prevent duplicates based on title + pdfUrl/url combination

  // First, check if resource exists by title and pdfUrl/url
  const ciscoResource = await prisma.resource.findFirst({
    where: {
      title: "Reglamento del aula CISCO",
      pdfUrl: "/docs/aula-cisco.pdf"
    }
  });

  if (!ciscoResource) {
    await prisma.resource.create({
      data: {
        title: "Reglamento del aula CISCO",
        pdfUrl: "/docs/aula-cisco.pdf",
        categories: {
          connect: [{ id: rules.id }]
        }
      }
    });
    console.log('Created: Reglamento del aula CISCO');
  } else {
    console.log('Skipped: Reglamento del aula CISCO (already exists)');
  }

  const pumasResource = await prisma.resource.findFirst({
    where: {
      title: "Historia de los Pumas",
      url: "https://pumas.mx/historia"
    }
  });

  if (!pumasResource) {
    await prisma.resource.create({
      data: {
        title: "Historia de los Pumas",
        url: "https://pumas.mx/historia",
        categories: { connect: [{ id: soccer.id }] }
      }
    });
    console.log('Created: Historia de los Pumas');
  } else {
    console.log('Skipped: Historia de los Pumas (already exists)');
  }

  console.log('Seed categories and resources completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

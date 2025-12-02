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

  // 3. Create Test Posts
  // Check if posts already exist
  const existingPosts = await prisma.post.count();

  if (existingPosts === 0) {
    // Create a test Efeméride
    await prisma.post.create({
      data: {
        tipo: 'Efeméride',
        titulo: 'Fundación de la UNAM',
        blocks: {
          create: [
            {
              order: 1,
              tituloSeccion: 'Historia',
              descripcion: 'La Universidad Nacional Autónoma de México fue fundada el 22 de septiembre de 1910. Es una de las universidades más importantes de América Latina y cuenta con una rica historia académica.'
            }
          ]
        }
      }
    });

    // Create a test Biografía
    await prisma.post.create({
      data: {
        tipo: 'Biografía',
        titulo: 'Octavio Paz',
        blocks: {
          create: [
            {
              order: 1,
              tituloSeccion: 'Vida y Obra',
              descripcion: 'Octavio Paz fue un poeta, ensayista y diplomático mexicano, ganador del Premio Nobel de Literatura en 1990. Sus obras exploran temas de identidad mexicana, amor y poesía.'
            }
          ]
        }
      }
    });

    // Create test Exposiciones
    await prisma.post.create({
      data: {
        tipo: 'Exposiciones',
        titulo: 'Arte Mexicano Contemporáneo',
        blocks: {
          create: [
            {
              order: 1,
              tituloSeccion: 'Exposición',
              descripcion: 'Una muestra del arte mexicano contemporáneo con obras de artistas destacados que exploran la identidad cultural y las tradiciones de México.'
            }
          ]
        }
      }
    });

    await prisma.post.create({
      data: {
        tipo: 'Exposiciones',
        titulo: 'Fotografía Histórica de la UNAM',
        blocks: {
          create: [
            {
              order: 1,
              tituloSeccion: 'Colección Fotográfica',
              descripcion: 'Recorrido visual por la historia de la Universidad Nacional Autónoma de México a través de fotografías históricas que capturan momentos importantes desde su fundación hasta la actualidad.'
            }
          ]
        }
      }
    });

    await prisma.post.create({
      data: {
        tipo: 'Exposiciones',
        titulo: 'Murales de Ciudad Universitaria',
        blocks: {
          create: [
            {
              order: 1,
              tituloSeccion: 'Arte Monumental',
              descripcion: 'Exposición dedicada a los murales icónicos de Ciudad Universitaria, patrimonio cultural de la humanidad. Incluye obras de Diego Rivera, David Alfaro Siqueiros y Juan O\'Gorman.'
            }
          ]
        }
      }
    });

    await prisma.post.create({
      data: {
        tipo: 'Exposiciones',
        titulo: 'Ciencia y Tecnología en México',
        blocks: {
          create: [
            {
              order: 1,
              tituloSeccion: 'Innovación Mexicana',
              descripcion: 'Muestra interactiva sobre los avances científicos y tecnológicos desarrollados en México, destacando investigaciones de la UNAM en áreas como astronomía, biotecnología y energías renovables.'
            }
          ]
        }
      }
    });

    console.log('Created test posts');
  } else {
    console.log('Skipped: Test posts (already exist)');
  }

  console.log('Seed categories, resources, and posts completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

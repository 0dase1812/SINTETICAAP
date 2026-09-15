const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const cancha = await prisma.tipoEspacio.upsert({
    where: { nombre: 'cancha' },
    update: {},
    create: { nombre: 'cancha' },
  });

  const billar = await prisma.tipoEspacio.upsert({
    where: { nombre: 'billar' },
    update: {},
    create: { nombre: 'billar' },
  });

  const espaciosExistentes = await prisma.espacio.count();

  if (espaciosExistentes === 0) {
    await prisma.espacio.createMany({
      data: [
        { nombre: 'Cancha Sintetica 1', precioPorHora: 25, tipoEspacioId: cancha.id },
        { nombre: 'Cancha Sintetica 2', precioPorHora: 30, tipoEspacioId: cancha.id },
        { nombre: 'Cancha Sintetica 3', precioPorHora: 28, tipoEspacioId: cancha.id },
        { nombre: 'Mesa de Billar 1', precioPorHora: 10, tipoEspacioId: billar.id },
        { nombre: 'Mesa de Billar 2', precioPorHora: 12, tipoEspacioId: billar.id },
      ],
    });
  }

  await prisma.usuario.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: { nombre: 'Usuario Demo', email: 'demo@example.com' },
  });

  console.log('Seed completado.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

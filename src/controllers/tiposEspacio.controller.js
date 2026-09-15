const prisma = require('../lib/prisma');

async function listarTiposEspacio(req, res) {
  const tipos = await prisma.tipoEspacio.findMany({ orderBy: { nombre: 'asc' } });
  res.json(tipos);
}

module.exports = { listarTiposEspacio };

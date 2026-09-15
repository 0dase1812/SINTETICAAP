const prisma = require('../lib/prisma');

const CAMPOS_ORDENABLES = ['id', 'nombre', 'precioPorHora'];

async function listarEspacios(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
  const { tipo, order } = req.query;
  const orderBy = CAMPOS_ORDENABLES.includes(req.query.orderBy) ? req.query.orderBy : 'id';
  const direccion = order === 'desc' ? 'desc' : 'asc';

  const where = tipo ? { tipoEspacio: { nombre: tipo } } : {};

  const [total, data] = await Promise.all([
    prisma.espacio.count({ where }),
    prisma.espacio.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [orderBy]: direccion },
      include: { tipoEspacio: true },
    }),
  ]);

  res.json({
    total,
    page,
    limit,
    totalPages: Math.max(Math.ceil(total / limit), 1),
    data,
  });
}

async function obtenerEspacio(req, res) {
  const id = Number(req.params.id);
  const espacio = await prisma.espacio.findUnique({
    where: { id },
    include: { tipoEspacio: true },
  });

  if (!espacio) {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }

  res.json(espacio);
}

async function crearEspacio(req, res) {
  const tipoEspacio = await prisma.tipoEspacio.findUnique({ where: { id: req.body.tipoEspacioId } });

  if (!tipoEspacio) {
    return res.status(400).json({ error: 'Datos invalidos', detalles: [{ campo: 'tipoEspacioId', mensaje: 'El tipo de espacio indicado no existe' }] });
  }

  const espacio = await prisma.espacio.create({
    data: req.body,
    include: { tipoEspacio: true },
  });

  res.status(201).json(espacio);
}

module.exports = { listarEspacios, obtenerEspacio, crearEspacio };

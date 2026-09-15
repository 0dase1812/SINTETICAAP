const prisma = require('../lib/prisma');

async function listarUsuarios(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

  const [total, data] = await Promise.all([
    prisma.usuario.count(),
    prisma.usuario.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'asc' },
      select: { id: true, nombre: true, email: true, createdAt: true },
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

async function obtenerUsuario(req, res) {
  const id = Number(req.params.id);
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: { id: true, nombre: true, email: true, createdAt: true },
  });

  if (!usuario) {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }

  res.json(usuario);
}

async function crearUsuario(req, res) {
  const existente = await prisma.usuario.findUnique({ where: { email: req.body.email } });

  if (existente) {
    return res.status(400).json({ error: 'Datos invalidos', detalles: [{ campo: 'email', mensaje: 'Ya existe un usuario con ese email' }] });
  }

  const usuario = await prisma.usuario.create({
    data: req.body,
    select: { id: true, nombre: true, email: true, createdAt: true },
  });

  res.status(201).json(usuario);
}

module.exports = { listarUsuarios, obtenerUsuario, crearUsuario };

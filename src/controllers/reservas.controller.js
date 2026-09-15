const prisma = require('../lib/prisma');

const includeRelaciones = {
  usuario: { select: { id: true, nombre: true, email: true } },
  espacio: { include: { tipoEspacio: true } },
};

async function listarReservas(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

  const [total, data] = await Promise.all([
    prisma.reserva.count(),
    prisma.reserva.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'asc' },
      include: includeRelaciones,
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

async function obtenerReserva(req, res) {
  const id = Number(req.params.id);
  const reserva = await prisma.reserva.findUnique({
    where: { id },
    include: includeRelaciones,
  });

  if (!reserva) {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }

  res.json(reserva);
}

async function crearReserva(req, res) {
  const { usuarioId, espacioId, fechaInicio, fechaFin } = req.body;

  const [usuario, espacio] = await Promise.all([
    prisma.usuario.findUnique({ where: { id: usuarioId } }),
    prisma.espacio.findUnique({ where: { id: espacioId } }),
  ]);

  if (!usuario) {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }

  if (!espacio) {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }

  const reserva = await prisma.reserva.create({
    data: {
      usuarioId,
      espacioId,
      fechaInicio: new Date(fechaInicio),
      fechaFin: new Date(fechaFin),
    },
    include: includeRelaciones,
  });

  res.status(201).json(reserva);
}

module.exports = { listarReservas, obtenerReserva, crearReserva };

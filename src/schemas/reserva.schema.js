const { z } = require('zod');

const reservaSchema = z.object({
  usuarioId: z.number({ required_error: 'El usuarioId es obligatorio' }).int().positive(),
  espacioId: z.number({ required_error: 'El espacioId es obligatorio' }).int().positive(),
  fechaInicio: z.string({ required_error: 'La fechaInicio es obligatoria' }).datetime('fechaInicio debe ser una fecha ISO valida'),
  fechaFin: z.string({ required_error: 'La fechaFin es obligatoria' }).datetime('fechaFin debe ser una fecha ISO valida'),
});

module.exports = { reservaSchema };

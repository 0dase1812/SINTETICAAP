const { z } = require('zod');

const espacioSchema = z.object({
  nombre: z.string({ required_error: 'El nombre es obligatorio' }).min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().optional(),
  precioPorHora: z.number({ required_error: 'El precio por hora es obligatorio' }).positive('El precio debe ser mayor a 0'),
  tipoEspacioId: z.number({ required_error: 'El tipoEspacioId es obligatorio' }).int().positive(),
  disponible: z.boolean().optional(),
});

module.exports = { espacioSchema };

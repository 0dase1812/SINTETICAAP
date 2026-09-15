const { z } = require('zod');

const usuarioSchema = z.object({
  nombre: z.string({ required_error: 'El nombre es obligatorio' }).min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string({ required_error: 'El email es obligatorio' }).email('El formato del email es invalido'),
});

module.exports = { usuarioSchema };

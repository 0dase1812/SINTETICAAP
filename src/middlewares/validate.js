// Middleware de validacion generico basado en un schema de Zod
const validate = (schema) => (req, res, next) => {
  const resultado = schema.safeParse(req.body);

  if (!resultado.success) {
    const detalles = resultado.error.issues.map((issue) => ({
      campo: issue.path.join('.') || '(body)',
      mensaje: issue.message,
    }));

    return res.status(400).json({
      error: 'Datos invalidos',
      detalles,
    });
  }

  req.body = resultado.data;
  next();
};

module.exports = validate;

// Middleware global de errores: evita que una excepcion no controlada tumbe el proceso de Node
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  const status = err.status || 500;
  const mensaje = status === 500 ? 'Error interno del servidor' : err.message;

  res.status(status).json({ error: mensaje });
}

module.exports = errorHandler;

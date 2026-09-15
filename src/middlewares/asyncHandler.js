// Evita repetir try/catch en cada controlador async y reenvia errores al error handler global
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;

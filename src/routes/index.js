const express = require('express');
const espaciosRoutes = require('./espacios.routes');
const usuariosRoutes = require('./usuarios.routes');
const reservasRoutes = require('./reservas.routes');
const tiposEspacioRoutes = require('./tiposEspacio.routes');

const router = express.Router();

router.use('/espacios', espaciosRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/reservas', reservasRoutes);
router.use('/tipos-espacio', tiposEspacioRoutes);

module.exports = router;

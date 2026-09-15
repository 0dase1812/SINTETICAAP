const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const { listarTiposEspacio } = require('../controllers/tiposEspacio.controller');

const router = express.Router();

/**
 * @openapi
 * /tipos-espacio:
 *   get:
 *     summary: Lista los tipos de espacio disponibles (ej. cancha, billar)
 *     tags: [TiposEspacio]
 *     responses:
 *       200: { description: Lista de tipos de espacio }
 */
router.get('/', asyncHandler(listarTiposEspacio));

module.exports = router;

const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const { espacioSchema } = require('../schemas/espacio.schema');
const { listarEspacios, obtenerEspacio, crearEspacio } = require('../controllers/espacios.controller');

const router = express.Router();

/**
 * @openapi
 * /espacios:
 *   get:
 *     summary: Lista los espacios (canchas sinteticas y mesas de billar) con paginacion y filtros
 *     tags: [Espacios]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: tipo
 *         schema: { type: string }
 *         description: Filtra por nombre del tipo de espacio, ej. "cancha" o "billar"
 *       - in: query
 *         name: orderBy
 *         schema: { type: string, enum: [id, nombre, precioPorHora] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Lista paginada de espacios
 */
router.get('/', asyncHandler(listarEspacios));

/**
 * @openapi
 * /espacios/{id}:
 *   get:
 *     summary: Obtiene un espacio por su ID
 *     tags: [Espacios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Espacio encontrado }
 *       404: { description: Recurso no encontrado }
 */
router.get('/:id', asyncHandler(obtenerEspacio));

/**
 * @openapi
 * /espacios:
 *   post:
 *     summary: Crea un nuevo espacio
 *     tags: [Espacios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, precioPorHora, tipoEspacioId]
 *             properties:
 *               nombre: { type: string }
 *               descripcion: { type: string }
 *               precioPorHora: { type: number }
 *               tipoEspacioId: { type: integer }
 *               disponible: { type: boolean }
 *     responses:
 *       201: { description: Espacio creado }
 *       400: { description: Datos invalidos }
 */
router.post('/', validate(espacioSchema), asyncHandler(crearEspacio));

module.exports = router;

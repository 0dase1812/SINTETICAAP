const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const { reservaSchema } = require('../schemas/reserva.schema');
const { listarReservas, obtenerReserva, crearReserva } = require('../controllers/reservas.controller');

const router = express.Router();

/**
 * @openapi
 * /reservas:
 *   get:
 *     summary: Lista las reservas con paginacion
 *     tags: [Reservas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Lista paginada de reservas }
 */
router.get('/', asyncHandler(listarReservas));

/**
 * @openapi
 * /reservas/{id}:
 *   get:
 *     summary: Obtiene una reserva por su ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Reserva encontrada }
 *       404: { description: Recurso no encontrado }
 */
router.get('/:id', asyncHandler(obtenerReserva));

/**
 * @openapi
 * /reservas:
 *   post:
 *     summary: Crea una nueva reserva de un espacio para un usuario
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usuarioId, espacioId, fechaInicio, fechaFin]
 *             properties:
 *               usuarioId: { type: integer }
 *               espacioId: { type: integer }
 *               fechaInicio: { type: string, format: date-time }
 *               fechaFin: { type: string, format: date-time }
 *     responses:
 *       201: { description: Reserva creada }
 *       400: { description: Datos invalidos }
 *       404: { description: Usuario o espacio no encontrado }
 */
router.post('/', validate(reservaSchema), asyncHandler(crearReserva));

module.exports = router;

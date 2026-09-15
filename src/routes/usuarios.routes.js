const express = require('express');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const { usuarioSchema } = require('../schemas/usuario.schema');
const { listarUsuarios, obtenerUsuario, crearUsuario } = require('../controllers/usuarios.controller');

const router = express.Router();

/**
 * @openapi
 * /usuarios:
 *   get:
 *     summary: Lista los usuarios con paginacion
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Lista paginada de usuarios }
 */
router.get('/', asyncHandler(listarUsuarios));

/**
 * @openapi
 * /usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuario encontrado }
 *       404: { description: Recurso no encontrado }
 */
router.get('/:id', asyncHandler(obtenerUsuario));

/**
 * @openapi
 * /usuarios:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email]
 *             properties:
 *               nombre: { type: string }
 *               email: { type: string, format: email }
 *     responses:
 *       201: { description: Usuario creado }
 *       400: { description: Email invalido o campos obligatorios faltantes }
 */
router.post('/', validate(usuarioSchema), asyncHandler(crearUsuario));

module.exports = router;

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestion de Reservas de Espacios',
      version: '1.0.0',
      description:
        'API REST para gestionar la reserva de espacios deportivos y de entretenimiento (canchas sinteticas y mesas de billar).',
    },
    servers: [{ url: '/api', description: 'API base' }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);

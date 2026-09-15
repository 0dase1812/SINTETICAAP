const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

const ORIGENES_PERMITIDOS = ['http://localhost:5173'];

app.use(cors({ origin: ORIGENES_PERMITIDOS }));
app.use(express.json());
app.use(logger);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

// Cualquier otra ruta no definida se trata como recurso no encontrado
app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

app.use(errorHandler);

module.exports = app;

# SINTETICAAP — API de Gestión de Reservas de Espacios

MVP de backend para un sistema de reservas de espacios deportivos y de entretenimiento
(**canchas sintéticas** y **mesas de billar**), construido con Node.js, Express y Prisma
sobre SQLite.

## Arquitectura

```
src/
  server.js            Punto de entrada (levanta el servidor HTTP)
  app.js               Configuración de Express: CORS, logger, rutas, error handler
  lib/prisma.js         Cliente Prisma (singleton)
  middlewares/
    logger.js            Loguea método, URL, status y tiempo de respuesta
    errorHandler.js       Manejador de errores global
    validate.js           Middleware genérico de validación con Zod
    asyncHandler.js        Wrapper para controladores async/await
  schemas/               Esquemas Zod (usuario, espacio, reserva)
  routes/                Definición de rutas + documentación OpenAPI (JSDoc)
  controllers/           Lógica de negocio, habla con Prisma
  docs/swagger.js        Configuración de swagger-jsdoc

prisma/
  schema.prisma          Modelo de datos (relaciones 1:N)
  seed.js                Datos de ejemplo
```

Flujo de una request: **Ruta → Middleware de validación → Controlador → Prisma (Base de datos)**.

### Modelo de datos (relaciones 1:N)

- `TipoEspacio` (1) → `Espacio` (N): cada espacio tiene un `tipoEspacioId` (ej. "cancha", "billar").
- `Usuario` (1) → `Reserva` (N): cada reserva tiene un `usuarioId`.
- `Espacio` (1) → `Reserva` (N): cada reserva tiene un `espacioId`.

## Requisitos

- Node.js 18+
- npm

## Puesta en marcha

```bash
npm install
npx prisma migrate dev --name init   # crea prisma/dev.db y aplica el esquema
npm run seed                          # carga datos de ejemplo
npm run dev                           # levanta el servidor con nodemon en http://localhost:3000
```

Variables de entorno (`.env`, ver `.env.example`):

```
DATABASE_URL="file:./dev.db"
PORT=3000
```

Documentación interactiva (Swagger UI): `http://localhost:3000/docs`

## Endpoints principales

Todas las rutas cuelgan del prefijo `/api`.

| Método | Ruta                 | Descripción                                              |
|--------|----------------------|-----------------------------------------------------------|
| GET    | `/api/espacios`      | Lista paginada, con filtro `tipo` y orden (`orderBy`, `order`) |
| GET    | `/api/espacios/:id`  | Detalle de un espacio (404 si no existe)                  |
| POST   | `/api/espacios`      | Crea un espacio                                            |
| GET    | `/api/usuarios`      | Lista paginada de usuarios                                 |
| GET    | `/api/usuarios/:id`  | Detalle de un usuario (404 si no existe)                   |
| POST   | `/api/usuarios`      | Registra un usuario (valida `email` y `nombre` con Zod, 400 si es inválido) |
| GET    | `/api/reservas`      | Lista paginada de reservas                                  |
| GET    | `/api/reservas/:id`  | Detalle de una reserva (404 si no existe)                   |
| POST   | `/api/reservas`      | Crea una reserva (404 si `usuarioId`/`espacioId` no existen) |
| GET    | `/api/tipos-espacio` | Lista los tipos de espacio (`cancha`, `billar`, ...)         |

### Paginación

`GET /api/espacios?page=1&limit=10` responde:

```json
{
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "data": [ ... ]
}
```

Filtros y orden soportados en `/api/espacios`:

- `tipo=cancha` o `tipo=billar` → filtra por tipo de espacio.
- `orderBy=precioPorHora|nombre|id` y `order=asc|desc` → ordenamiento explícito (ej. precio de menor a mayor).

### Errores

- **400 Bad Request**: `POST /api/usuarios` con email inválido o campos faltantes.

  ```json
  { "error": "Datos invalidos", "detalles": [{ "campo": "email", "mensaje": "El formato del email es invalido" }] }
  ```

- **404 Not Found**: cualquier `GET/:id` (o ruta inexistente) sobre un recurso que no existe.

  ```json
  { "error": "Recurso no encontrado" }
  ```

## CORS

Configurado con la librería `cors` permitiendo el origen `http://localhost:5173` (Vite/React).

## Consumo desde el frontend (loading / error / success)

Ejemplo con React manejando explícitamente los 3 estados de la UI:

```jsx
import { useEffect, useState } from 'react';

function ListaEspacios() {
  const [estado, setEstado] = useState('loading'); // 'loading' | 'error' | 'success'
  const [espacios, setEspacios] = useState([]);

  useEffect(() => {
    async function cargarEspacios() {
      setEstado('loading');
      try {
        const res = await fetch('http://localhost:3000/api/espacios?page=1&limit=10');
        if (!res.ok) throw new Error('Error al obtener los espacios');
        const { data } = await res.json();
        setEspacios(data);
        setEstado('success');
      } catch (err) {
        setEstado('error');
      }
    }
    cargarEspacios();
  }, []);

  if (estado === 'loading') return <p>Cargando espacios...</p>;
  if (estado === 'error') return <p>Ocurrió un error al cargar los espacios.</p>;

  return (
    <ul>
      {espacios.map((e) => (
        <li key={e.id}>{e.nombre} — ${e.precioPorHora}/hora</li>
      ))}
    </ul>
  );
}
```

## Scripts disponibles

```bash
npm run dev              # servidor en modo desarrollo (nodemon)
npm start                # servidor en modo producción
npm run prisma:migrate   # aplica migraciones
npm run prisma:generate  # regenera el cliente Prisma
npm run seed             # carga datos de ejemplo
```

## Subir el proyecto a tu propio repositorio

Si quieres moverlo a un repositorio propio en lugar del actual:

```bash
git init
git add .
git commit -m "feat: MVP API gestion de reservas de espacios"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/gestion-espacios-backend.git
git push -u origin main
```

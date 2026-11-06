# API REST

**URL base en desarrollo:** `http://localhost:4000`

Las peticiones y respuestas usan JSON. Las rutas protegidas requieren este encabezado:

```http
Authorization: Bearer <token>
```

## Resumen de endpoints

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/health` | Público |
| POST | `/auth/login` | Público |
| GET | `/informacion-general` | Público |
| PUT | `/informacion-general` | Junta |
| GET | `/parametros` | Público |
| POST | `/parametros` | Junta |
| PUT | `/parametros` | Junta |
| GET | `/tarifa/config` | Público |
| PUT | `/tarifa/config` | Junta, entidad rectora |
| GET | `/costeo` | Público |
| PUT | `/costeo` | Junta |
| GET | `/fortalecimiento` | Público; el resultado varía según el rol |
| GET | `/fortalecimiento/:slug` | Según la capacitación |
| GET | `/noticias` | Público |
| GET | `/noticias/:id` | Público |
| POST | `/noticias` | Junta |
| PUT | `/noticias/:id` | Junta |
| DELETE | `/noticias/:id` | Junta |
| GET | `/reportes-danos` | Público; los datos personales solo para la junta |
| POST | `/reportes-danos` | Público |
| DELETE | `/reportes-danos/:id` | Junta |

## Errores

Los errores controlados responden con este formato:

```json
{ "error": "Mensaje descriptivo" }
```

| Código | Significado |
|---|---|
| 400 | Datos faltantes o inválidos |
| 401 | Credenciales incorrectas, o token ausente, inválido o expirado |
| 403 | El rol no tiene permiso |
| 404 | El recurso o la ruta no existe |
| 409 | Ya existen parámetros para ese semestre |
| 429 | Demasiadas peticiones en `POST /auth/login` o `POST /reportes-danos` |
| 500 | Error interno del servidor |

## Autenticación

### `POST /auth/login`

```json
{ "email": "correo@ejemplo.com", "password": "contraseña" }
```

**Respuesta 200:**

```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": "uuid",
    "email": "correo@ejemplo.com",
    "role": "JUNTA",
    "nombre": "Directiva"
  }
}
```

**Errores:** 400 si falta un campo, 401 si las credenciales no son válidas y 429 tras 10 intentos fallidos en 15 minutos.

No hay endpoints de registro ni de cierre de sesión. Para cerrar sesión, el cliente descarta el token.

## Información general

### `GET /informacion-general`

Devuelve el registro único de la junta, o 404 si todavía no se ha configurado.

```json
{
  "id": "uuid",
  "familias": 0,
  "habitantes": 0,
  "localidadesAtendidas": "",
  "canton": "",
  "provincia": "",
  "zonaUtm": "",
  "coordenadaEste": "",
  "coordenadaSur": "",
  "cota": "",
  "presidente": "",
  "telefonoContacto": "",
  "telefonoJunta": "",
  "horarioAtencion": "",
  "fotoUrl": null,
  "mapaUrl": null,
  "actualizadoPorId": null,
  "updatedAt": "2026-09-28T12:00:00.000Z"
}
```

### `PUT /informacion-general`

Actualiza solo los campos enviados y crea el registro si no existe. Admite todos los campos de la respuesta, excepto `id`, `actualizadoPorId` y `updatedAt`; cualquier otro se ignora.

`familias` y `habitantes` deben ser enteros mayores o iguales a 0, `fotoUrl` y `mapaUrl` admiten texto o `null`, y el resto debe ser texto.

**Errores:** 400 si un campo tiene un tipo inválido.

## Parámetros

### `GET /parametros`

| Parámetro de consulta | Requerido | Descripción |
|---|---|---|
| `mes` | No | Filtra por semestre, por ejemplo `2026-II`. Sin él, devuelve todos |

Ordena por semestre descendente, categoría y nombre. Según el parámetro, cada fila incluye datos del catálogo: `opciones` y `opcionCumple` para valores predefinidos, o `min` y `max` para rangos numéricos.

```json
[
  {
    "id": "uuid",
    "mes": "2026-II",
    "categoria": "calidad",
    "nombre": "Sabor",
    "limite": "Aceptable / sin sabor extraño",
    "valor": "Aceptable",
    "estado": "ok",
    "publicadoEn": "2026-09-28T12:00:00.000Z",
    "creadoPorId": null,
    "opciones": ["Aceptable", "No aceptable"],
    "opcionCumple": "Aceptable"
  }
]
```

### `POST /parametros`

Crea todas las filas del catálogo para un semestre, con valor vacío y estado `pendiente`.

```json
{ "mes": "2027-I" }
```

**Respuesta:** 201 con las filas creadas.
**Errores:** 400 si `mes` falta o no tiene el formato `AAAA-I` o `AAAA-II`, y 409 si el semestre ya existe.

### `PUT /parametros`

Actualiza varias filas en una transacción: se guardan todas o ninguna. Responde 200 con las filas actualizadas.

```json
{
  "filas": [
    { "id": "uuid", "valor": "2.1", "estado": "ok" },
    { "id": "uuid", "valor": "", "estado": "pendiente" }
  ]
}
```

- Una fila con valor debe tener `estado` `ok` o `alerta`; una sin valor, `pendiente`.
- Si el parámetro tiene `opciones`, `valor` debe ser una de ellas o estar vacío.
- `publicadoEn` se actualiza con la fecha actual.

**Errores:** 400 si los datos no son válidos y 404 si algún parámetro no existe.

## Tarifa

### `GET /tarifa/config`

Devuelve la configuración vigente, o 404 si no existe.

```json
{
  "id": "uuid",
  "cargoFijo": 3,
  "cargoVariable": 0.5,
  "umbralConsumo": 10,
  "descuentoAdultoMayorPct": 50,
  "vigenteDesde": "2026-09-28T12:00:00.000Z",
  "actualizadoPorId": null
}
```

### `PUT /tarifa/config`

Todos los campos son opcionales y deben ser números mayores o iguales a 0. Actualiza `vigenteDesde` y crea la configuración si no existe. Los cambios no conservan historial.

```json
{
  "cargoFijo": 3.5,
  "cargoVariable": 0.6,
  "umbralConsumo": 12,
  "descuentoAdultoMayorPct": 50
}
```

**Errores:** 400 si algún valor no es válido o si el descuento supera el 100 %.

El cálculo del valor a pagar se hace en el frontend. Consulta la [fórmula](funcionalidades.md#tarifa-tarifa).

## Costeo

### `GET /costeo`

Devuelve los componentes ordenados por `orden`. `cantidadAnual` y `precioUnitario` pueden ser `null`.

```json
[
  {
    "id": "uuid",
    "orden": 1,
    "componente": "Mano de obra",
    "rubro": "Operador",
    "unidad": "mes",
    "cantidadAnual": 12,
    "precioUnitario": null,
    "actualizadoPorId": null,
    "updatedAt": "2026-09-28T12:00:00.000Z"
  }
]
```

### `PUT /costeo`

Actualiza varias filas en una transacción: se guardan todas o ninguna. `cantidadAnual` y `precioUnitario` son opcionales; deben ser números mayores o iguales a 0, o `null` para dejarlos vacíos. Responde 200 con las filas actualizadas.

```json
{
  "filas": [{ "id": "uuid", "cantidadAnual": 12, "precioUnitario": 450 }]
}
```

**Errores:** 400 si un valor no es válido y 404 si algún componente no existe.

## Fortalecimiento

Si se envía un token válido, estas rutas lo usan para incluir el contenido restringido. Un token inválido se trata como una visita anónima y no produce error.

| `slug` | Tipo | Acceso |
|---|---|---|
| `participacion-comunitaria` | `texto` | Público |
| `rol-mujer-gestion-agua` | `texto` | Público |
| `protocolos-operativos` | `video` | Junta, entidad rectora |
| `costos-servicio` | `texto` | Junta, entidad rectora |

### `GET /fortalecimiento`

Lista las capacitaciones visibles para quien hace la petición.

```json
[
  {
    "slug": "participacion-comunitaria",
    "titulo": "Fortalecimiento de la participación comunitaria",
    "tipo": "texto"
  }
]
```

### `GET /fortalecimiento/:slug`

Devuelve la capacitación completa. Responde 404 tanto si no existe como si el rol no tiene acceso, para no revelar contenido restringido.

```json
{
  "slug": "participacion-comunitaria",
  "titulo": "Fortalecimiento de la participación comunitaria",
  "tipo": "texto",
  "rolesAcceso": [],
  "videoUrl": "https://youtube.com/shorts/...",
  "contenido": {
    "indice": ["Título de una sección"],
    "secciones": [
      {
        "id": "opcional",
        "titulo": "Título de una sección",
        "parrafos": ["Texto"],
        "destacado": "Texto resaltado",
        "subtitulo": "Subtítulo",
        "lista": [{ "fuerte": "Término", "texto": "Descripción" }],
        "tabla": { "columnas": ["A"], "filas": [["1"]] }
      }
    ]
  }
}
```

Solo `titulo` es obligatorio en cada sección. En las capacitaciones de tipo `video`, `contenido` es una cadena con la URL, o está vacía si el video aún no está disponible.

## Noticias

### Modelo

```json
{
  "id": "uuid",
  "titulo": "Título",
  "resumen": "Resumen o null",
  "contenido": "Texto completo",
  "imagenesUrl": ["https://..."],
  "videosUrl": ["https://..."],
  "creadoPorId": "uuid",
  "actualizadoPorId": null,
  "createdAt": "2026-09-28T12:00:00.000Z",
  "updatedAt": "2026-09-28T12:00:00.000Z"
}
```

### `GET /noticias`

Devuelve todas las noticias, de la más reciente a la más antigua, sin paginación.

### `GET /noticias/:id`

Devuelve una noticia, o 404 si no existe.

### `POST /noticias`

`titulo` y `contenido` son obligatorios. Las listas descartan los elementos vacíos o que no sean texto.

```json
{
  "titulo": "Corte programado",
  "resumen": "Mantenimiento de la red",
  "contenido": "Detalle de la noticia",
  "imagenesUrl": ["https://ejemplo.com/foto.jpg"],
  "videosUrl": []
}
```

**Respuesta:** 201 con la noticia creada.
**Errores:** 400 si falta un campo obligatorio o tiene un tipo inválido.

### `PUT /noticias/:id`

Actualiza solo los campos enviados.

**Errores:** 400 si un campo no es válido y 404 si la noticia no existe.

### `DELETE /noticias/:id`

**Respuesta:** 204 sin contenido.
**Errores:** 404 si la noticia no existe.

## Reportes de daños

### `GET /reportes-danos`

Devuelve todos los reportes, del más reciente al más antiguo, sin paginación. Con un token de la junta incluye todos los campos:

```json
[
  {
    "id": "uuid",
    "nombre": "Nombre",
    "cedula": null,
    "medidor": "M-0412",
    "telefono": null,
    "descripcion": "Fuga en la tubería",
    "imagenUrl": null,
    "createdAt": "2026-09-28T12:00:00.000Z"
  }
]
```

Para cualquier otra petición, incluida la entidad rectora, solo incluye `id`, `descripcion`, `imagenUrl` y `createdAt`.

### `POST /reportes-danos`

`nombre` y `descripcion` son obligatorios. El resto de los campos son opcionales, y un texto vacío se guarda como `null`.

```json
{
  "nombre": "Nombre",
  "cedula": "",
  "medidor": "M-0412",
  "telefono": "",
  "descripcion": "Fuga en la tubería",
  "imagenUrl": ""
}
```

`imagenUrl` debe empezar con `http://` o `https://`.

**Respuesta:** 201 con el reporte creado. Solo la junta recibe los datos personales en la respuesta.
**Errores:** 400 si falta un campo obligatorio o la URL no es válida, y 429 tras 20 reportes en una hora desde la misma IP.

### `DELETE /reportes-danos/:id`

**Respuesta:** 204 sin contenido.
**Errores:** 404 si el reporte no existe.

## Salud del servicio

### `GET /health`

```json
{ "status": "ok" }
```

No comprueba la conexión con la base de datos.

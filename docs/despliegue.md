# Despliegue

El proyecto se publica en tres piezas: una base de datos PostgreSQL, el backend en Render y el frontend en Vercel. Despliégalas en ese orden, porque cada una necesita la URL de la anterior.

## Variables de entorno

### Backend

| Variable | Requerida | Valor por defecto | Descripción |
|---|---|---|---|
| `DATABASE_URL` | Sí | | Cadena de conexión de PostgreSQL |
| `JWT_SECRET` | Sí | | Clave para firmar los tokens. El servidor no arranca sin ella |
| `JWT_EXPIRES_IN` | No | `8h` | Duración de la sesión |
| `PORT` | No | `4000` | Puerto del servidor |
| `CORS_ORIGIN` | En producción | Orígenes locales de Vite | URL del frontend. Sin ella, el frontend publicado no puede llamar a la API |
| `TRUST_PROXY_HOPS` | En producción | `0` | Proxies delante del servidor; permite identificar la IP real para el límite de peticiones. [render.yaml](../render.yaml) usa `1` |
| `SEED_JUNTA_EMAIL` | Para el seed | | Correo de la cuenta de la junta |
| `SEED_JUNTA_PASSWORD` | Para el seed | | Contraseña de la cuenta de la junta |
| `SEED_ENTIDAD_RECTORA_EMAIL` | Para el seed | | Correo de la cuenta de la entidad rectora |
| `SEED_ENTIDAD_RECTORA_PASSWORD` | Para el seed | | Contraseña de la cuenta de la entidad rectora |

Para generar un `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Si cambias `JWT_SECRET`, todas las sesiones activas dejan de ser válidas.

### Frontend

| Variable | Requerida | Valor por defecto | Descripción |
|---|---|---|---|
| `VITE_API_URL` | En producción | `http://localhost:4000` | URL del backend, sin barra final |

Vite incorpora esta variable al compilar. Si cambia, hay que volver a desplegar el frontend.

## Pasos

### 1. Base de datos

Crea una base PostgreSQL en el proveedor que prefieras y copia su cadena de conexión. Debe ser accesible desde Render y, para cargar el seed, desde tu equipo.

### 2. Backend en Render

[render.yaml](../render.yaml) define el servicio `aguagobernable-backend` en el plan gratuito:

| Etapa | Comando |
|---|---|
| Compilación | `npm install && npx prisma generate && npm run build` |
| Inicio | `npx prisma migrate deploy && npm start` |

1. Crea un Blueprint en Render a partir de este repositorio.
2. Completa las variables marcadas con `sync: false` cuando Render las solicite. Para `CORS_ORIGIN`, si aún no tienes la URL del frontend, vuelve a este paso al terminar el paso 3.
3. Comprueba que `GET /health` responde `{"status":"ok"}`.

Las migraciones se aplican solas en cada arranque, pero el seed no: ejecútalo por separado la primera vez.

En el plan gratuito, el servicio puede suspenderse por inactividad, y la primera petición posterior tarda más en responder.

### 3. Frontend en Vercel

1. Importa el repositorio en Vercel.
2. Define `frontend` como directorio raíz.
3. Añade `VITE_API_URL` con la URL del backend.
4. Despliega. El comando de compilación es `npm run build` y el directorio de salida es `dist`.

[vercel.json](../frontend/vercel.json) redirige todas las rutas a `index.html` para que React Router funcione al recargar una página.

### 4. Conectar ambos

Asigna a `CORS_ORIGIN` la URL exacta del frontend en Render, incluido `https://` y sin barra final. Solo admite un origen.

## Datos iniciales (seed)

El seed se ejecuta desde `backend/`, con `DATABASE_URL` y las variables `SEED_*` apuntando al entorno deseado:

```bash
npm run prisma:seed
```

| Datos | Comportamiento al ejecutarlo |
|---|---|
| Cuentas | Crea o actualiza las dos cuentas. **Restablece sus contraseñas** a las indicadas por las variables |
| Información general | Solo se crea si la tabla está vacía |
| Tarifa | Solo se crea si la tabla está vacía |
| Costeo | Solo se crea si la tabla está vacía |
| Parámetros | Se crean vacíos para el semestre actual si no existen |

> [!WARNING]
> Revisa estas situaciones antes de ejecutar el seed en producción:
>
> - Falla si falta alguna variable `SEED_*`.
> - Si cambias un correo `SEED_*`, se crea una cuenta nueva y la anterior sigue activa.
> - Ejecutarlo restablece las contraseñas de ambas cuentas.

## Cambios en la base de datos

1. Modifica [schema.prisma](../backend/prisma/schema.prisma).
2. Genera la migración en desarrollo:

   ```bash
   cd backend
   npx prisma migrate dev --name descripcion_del_cambio
   ```

3. Incluye la carpeta de la migración en el commit.
4. Render la aplica en el siguiente despliegue con `prisma migrate deploy`.

## Tareas de administración

### Crear o cambiar una cuenta

No hay interfaz de administración de cuentas. Para cambiar los datos de una cuenta del seed, ajusta sus variables `SEED_*` y vuelve a ejecutarlo, teniendo en cuenta las advertencias anteriores. Las cuentas adicionales se insertan directamente en la tabla `User`, con la contraseña en un hash de bcrypt.

### Publicar una capacitación

Edita [capacitaciones.ts](../backend/modules/fortalecimiento/capacitaciones.ts) y despliega el backend. Por ejemplo, el enlace del video de protocolos operativos va en el campo `contenido` de esa capacitación.

## Verificación

Después de cada despliegue, comprueba lo siguiente:

- [ ] `GET /health` responde correctamente.
- [ ] La página de inicio del frontend muestra datos reales.
- [ ] Puedes iniciar sesión.
- [ ] Sin sesión, la página de reportes no muestra datos personales.
- [ ] Una página interna, como `/parametros`, carga al recargarla directamente.
- [ ] Un cambio publicado se mantiene tras recargar la página.

# Plataforma JAAP El Limón–Havoline

Aplicación web para la gestión comunitaria del agua de la Junta Administradora de Agua Potable (JAAP) El Limón–Havoline, en el cantón Empalme, provincia del Guayas (Ecuador).

La comunidad puede consultar la información de la junta, los parámetros de calidad y cantidad del agua, el costeo del servicio y las noticias, calcular su valor a pagar y reportar daños. La directiva y la entidad rectora ingresan con una cuenta para administrar esos contenidos.

La plataforma atiende solo a esta junta: no es multi-junta.

## Documentación

| Documento | Contenido |
|---|---|
| [Funcionalidades](docs/funcionalidades.md) | Secciones, permisos por rol, reglas de negocio y limitaciones conocidas |
| [Arquitectura](docs/arquitectura.md) | Componentes, estructura del código, autenticación y modelo de datos |
| [API REST](docs/api.md) | Referencia de todos los endpoints del backend |
| [Despliegue](docs/despliegue.md) | Variables de entorno, migraciones, seed y publicación en Render y Vercel |

## Stack

| Parte | Tecnologías |
|---|---|
| Frontend | React 19, TypeScript, React Router 7, Tailwind CSS 4, Vite |
| Backend | Node.js, Express 5, TypeScript, Prisma 6, JWT, bcryptjs |
| Base de datos | PostgreSQL |
| Despliegue | Render (backend) y Vercel (frontend) |

## Puesta en marcha local

Requisitos: Node.js, npm y una base de datos PostgreSQL accesible.

### 1. Backend

Crea el archivo `backend/.env`:

```env
DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/aguagobernable"
JWT_SECRET="una-cadena-larga-y-aleatoria"
SEED_JUNTA_EMAIL="junta@ejemplo.test"
SEED_JUNTA_PASSWORD="elige-una-contraseña"
SEED_ENTIDAD_RECTORA_EMAIL="entidad@ejemplo.test"
SEED_ENTIDAD_RECTORA_PASSWORD="elige-otra-contraseña"
```

Instala las dependencias, crea las tablas, carga los datos iniciales y arranca el servidor:

```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

La API queda en `http://localhost:4000`. Para comprobarlo, `GET /health` responde `{"status":"ok"}`.

El seed crea una cuenta por rol con las credenciales de las variables `SEED_*`, y falla si falta alguna. Consulta [Despliegue](docs/despliegue.md#datos-iniciales-seed) antes de ejecutarlo en producción.

### 2. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite muestra la URL local, normalmente `http://localhost:5173`. Por defecto el frontend llama a `http://localhost:4000`. Para usar otra API, define `VITE_API_URL` en `frontend/.env`.

## Comandos

| Carpeta | Comando | Qué hace |
|---|---|---|
| `backend` | `npm run dev` | Inicia el servidor y lo reinicia al detectar cambios |
| `backend` | `npm run build` | Compila TypeScript a `dist/` |
| `backend` | `npm start` | Ejecuta la versión compilada |
| `backend` | `npm run prisma:migrate` | Aplica migraciones en desarrollo y crea nuevas si cambió el esquema |
| `backend` | `npm run prisma:seed` | Carga cuentas y datos iniciales |
| `frontend` | `npm run dev` | Inicia el servidor de desarrollo |
| `frontend` | `npm run build` | Verifica los tipos y genera `dist/` |
| `frontend` | `npm run lint` | Ejecuta oxlint |
| `frontend` | `npm run preview` | Sirve localmente la versión compilada |

El proyecto todavía no tiene pruebas automatizadas ni CI.

## Estructura del repositorio

```text
backend/    API REST, esquema de Prisma, migraciones y seed
frontend/   Aplicación React
docs/       Documentación del proyecto
render.yaml Configuración del servicio del backend en Render
```

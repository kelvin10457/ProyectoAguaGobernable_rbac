# Plan: Backend con Role-Based Access Control (RBAC)

Estado: **planeación**, sin código todavía. Este documento resume lo acordado en el chat para no perderlo.

## 1. Roles

| Rol | Cómo obtiene la cuenta | Descripción |
|---|---|---|
| `usuario` | No aplica (acceso libre, sin login) | Cualquier persona de la comunidad, solo consulta |
| `junta` | Cuenta creada manualmente (seed/script), correo + contraseña | Directiva del JAAP El Limón–Havoline |
| `entidad_rectora` | Cuenta creada manualmente (seed/script), correo + contraseña | Por ahora **mismos permisos que `junta`** (pendiente diferenciar más adelante) |

No hay auto-registro público: ninguna de las dos cuentas se crea desde un formulario abierto. Las crea quien administra el sistema (por ahora, un script de seed / inserción manual en la base de datos). Por eso el backend **no** expone un endpoint `POST /auth/register`.

Nota de diseño: aunque `junta` y `entidad_rectora` hoy tengan los mismos permisos, en el backend **no** se deben tratar como un único booleano tipo `isAdmin`. Cada endpoint debe declarar explícitamente su lista de roles permitidos (`['junta', 'entidad_rectora']`), para que el día que se diferencien baste con cambiar esa lista en un solo lugar.

## 2. Matriz de permisos por sección

| Sección / recurso | `usuario` | `junta` | `entidad_rectora` |
|---|---|---|---|
| Inicio | Ver | Ver | Ver |
| Información general | Ver | Ver + Editar | Ver |
| Parámetros (calidad/cantidad) | Ver | Ver + Editar + Añadir mes nuevo | Ver + Editar + Añadir mes nuevo |
| Tarifa (calculadora pública) | Ver / calcular | Ver / calcular | Ver / calcular |
| Tarifa → parámetros de cálculo (cargo fijo, cargo variable, umbral, etc.) | — | Ver + Editar | Ver + Editar |
| Fortalecimiento → "Protocolos operativos" (video placeholder) | Ver | Ver | Ver |
| Fortalecimiento → "Determinación de costos del servicio" (texto placeholder) | — (oculto) | Ver | Ver |

Las líneas A ("Fortalecimiento administrativo y normativo") y C ("Gobernanza y corresponsabilidad") que hoy aparecen en el mockup de `Fortalecimiento.tsx` **no están definidas todavía como capacitaciones reales** con contenido/rol asignado — quedan fuera de este alcance hasta que se decida qué mostrar ahí.

## 3. Fortalecimiento como lista de capacitaciones

Hoy `Fortalecimiento.tsx` es una sola página estática. Pasa a ser:

- Una ruta índice `/fortalecimiento` que lista las capacitaciones disponibles **según el rol** (sublinks).
- Rutas hijas, una por capacitación, ej. `/fortalecimiento/protocolos-operativos` y `/fortalecimiento/costos-servicio`.
- Cada capacitación tiene: `slug`, `titulo`, `tipo` (`video` | `texto`), `rolesAcceso`, `contenido` (placeholder por ahora).
- El backend filtra qué capacitaciones se listan/sirven según el rol del token (o ausencia de token = `usuario`).

Dado que el contenido es placeholder y son solo 2 capacitaciones reales, se puede empezar con un catálogo estático en el backend (array en código) en vez de tabla en base de datos, y migrar a tabla cuando haya contenido real que administrar desde la Junta.

## 4. Modelo de datos propuesto (Prisma)

```prisma
enum Role {
  JUNTA
  ENTIDAD_RECTORA
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  role         Role
  nombre       String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model InformacionGeneral {
  id                 String   @id @default(uuid())
  familias           Int
  habitantes         Int
  localidadesAtendidas String
  canton             String
  provincia          String
  zonaUtm            String
  coordenadaEste     String
  coordenadaSur      String
  cota               String
  presidente         String
  telefonoContacto   String
  horarioAtencion    String
  fotoUrl            String?
  mapaUrl            String?
  actualizadoPorId   String?
  updatedAt          DateTime @updatedAt
}

model ParametroMes {
  id           String   @id @default(uuid())
  mes          String   // ej. "2026-08"
  categoria    String   // "calidad" | "cantidad"
  nombre       String   // Color, Turbiedad, Presión, etc.
  limite       String   // límite normativo (catálogo fijo)
  valor        String   // valor medido ese mes (vacío = pendiente)
  estado       String   // "ok" | "alerta" | "pendiente"
  publicadoEn  DateTime?
  creadoPorId  String?
}

model TarifaConfig {
  id                        String   @id @default(uuid())
  cargoFijo                 Float
  cargoVariable             Float
  umbralConsumo             Float
  descuentoAdultoMayorPct   Float    @default(50)
  vigenteDesde              DateTime @default(now())
  actualizadoPorId          String?
}
```

`InformacionGeneral` y `TarifaConfig` se modelan como filas únicas (singleton): la plataforma es **solo para El Limón–Havoline**, no multi-junta, así que no llevan `jaapId`.

`TarifaConfig` guarda únicamente los cargos **vigentes** (no historial). El usuario nunca ve una tarifa "de un mes anterior": lo que ve es el resultado de aplicar la configuración vigente a su propio consumo ingresado (cédula/medidor/consumo). Si más adelante se pide trazabilidad de cambios de tarifa, se puede añadir una tabla de auditoría aparte sin tocar este modelo.

Base de datos: **MySQL** (vía Prisma), consistente con la carpeta `prisma/` ya creada.

## 5. Autenticación

- Login con correo + contraseña (`bcrypt` para el hash).
- Emisión de JWT con claim `role`; el resto de la app no vuelve a tocar la base de datos para autorizar, solo lee el rol del token.
- Middleware `requireAuth` (valida token) + `requireRole(...roles)` (verifica que el rol esté en la lista permitida del endpoint).
- Rutas de solo lectura (`GET`) no requieren token; si viene un token válido, se usa el rol para decidir qué se devuelve (ej. filtrar capacitaciones).

## 6. Endpoints (borrador)

| Método | Ruta | Roles permitidos |
|---|---|---|
| POST | `/auth/login` | público |
| GET | `/informacion-general` | público |
| PUT | `/informacion-general` | `junta`, `entidad_rectora` |
| GET | `/parametros?mes=` | público |
| POST | `/parametros` (crear mes nuevo) | `junta`, `entidad_rectora` |
| PUT | `/parametros/:id` | `junta`, `entidad_rectora` |
| GET | `/tarifa/config` | público |
| PUT | `/tarifa/config` | `junta`, `entidad_rectora` |
| GET | `/fortalecimiento` | público (filtrado por rol si hay token) |
| GET | `/fortalecimiento/:slug` | público o según `rolesAcceso` de la capacitación |

## 7. Cambios que esto implica en el frontend (para después, no ahora)

- `types.ts`: `Role` pasa de `'usuario' | 'admin'` a `'usuario' | 'junta' | 'entidad_rectora'`.
- `JaapContext`: reemplazar `isAdmin` por algo como `isStaff` (= `role !== 'usuario'`) para los permisos que hoy comparten junta/entidad, sin perder la posibilidad de chequear el rol exacto donde haga falta.
- `Header`: el botón "Ingreso directiva" pasa a ser un ingreso genérico (ya no es exclusivo de directiva).
- `Login.tsx`: formulario real contra `/auth/login`, ya no un botón que simula sesión.
- `Fortalecimiento.tsx`: se reestructura en índice + sub-rutas filtradas por rol, en vez de mostrar todo a todos.
- `InformacionGeneral.tsx`: hoy es texto estático; necesita modo edición para `junta`/`entidad_rectora` (patrón similar al editar/publicar que ya existe en `Parametros.tsx`).
- `Parametros.tsx` y `Tarifa.tsx`: ya tienen la forma correcta (ver/editar condicionado a rol) — solo cambia la condición de `isAdmin` a `isStaff`.

## 8. Decisiones confirmadas

1. **Stack backend**: Express + Prisma + **MySQL**.
2. **Alta de `entidad_rectora` (y `junta`)**: cuentas creadas manualmente (seed/script), no hay endpoint público de registro.
3. **Tarifa**: el usuario solo ve el cálculo con la configuración vigente aplicada a su propio consumo; no hay vista de tarifas de meses anteriores.
4. **Alcance**: solo El Limón–Havoline, no multi-junta. `InformacionGeneral` y `TarifaConfig` quedan como singleton, sin `jaapId`.
5. **Primera diferenciación entre `junta` y `entidad_rectora`**: `entidad_rectora` pierde el permiso de editar Información General (queda solo `junta`, ver matriz de la sección 2). El resto de permisos se mantiene igual entre ambos roles por ahora. Al estar modelado como lista de roles por endpoint (no `isAdmin`), el cambio fue de una sola línea en `requireRole(...)`.

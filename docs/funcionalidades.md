# Funcionalidades

## Roles

| Rol | Valor en la API | Cómo se obtiene | Descripción |
|---|---|---|---|
| Usuario | Sin rol | Sin cuenta | Cualquier persona de la comunidad |
| Junta | `JUNTA` | Cuenta creada por el administrador | Directiva de la JAAP; administra casi todo el contenido |
| Entidad rectora | `ENTIDAD_RECTORA` | Cuenta creada por el administrador | Consulta la plataforma, accede a las capacitaciones restringidas y edita los cargos de la tarifa |

No existe registro público. Las cuentas se crean con el [seed](despliegue.md#datos-iniciales-seed) o directamente en la base de datos.

## Permisos por sección

| Sección | Usuario | Entidad rectora | Junta |
|---|---|---|---|
| Inicio | Ver | Ver | Ver y editar familias y habitantes |
| Información general | Ver | Ver | Ver y editar |
| Parámetros | Ver | Ver | Ver y editar |
| Costeo | Ver | Ver | Ver y editar |
| Tarifa: calculadora | Usar | Usar | Usar |
| Tarifa: cargos vigentes | Ver el resultado | Editar | Editar |
| Noticias | Ver | Ver | Ver, crear, editar y eliminar |
| Reportes de daños: descripción y foto | Ver y enviar | Ver y enviar | Ver, enviar y eliminar |
| Reportes de daños: nombre, cédula, medidor y teléfono | Oculto | Oculto | Ver |
| Fortalecimiento: participación comunitaria | Ver | Ver | Ver |
| Fortalecimiento: protocolos operativos | Oculto | Ver | Ver |
| Fortalecimiento: costos del servicio | Oculto | Ver | Ver |

## Secciones

### Inicio (`/`)

Muestra el resumen de la comunidad, el estado de los parámetros del último semestre y accesos a la calculadora y a las capacitaciones. La junta también ve sus pendientes, calculados con datos reales: mediciones sin registrar o semestre sin abrir, componentes del costeo sin precio y reportes por resolver.

### Información general (`/informacion-general`)

Reúne datos de la comunidad, ubicación, contactos, horario de atención, foto y mapa. La junta pega la URL de la foto y el enlace o código `<iframe>` del mapa; del código se extrae automáticamente la URL.

### Parámetros (`/parametros`)

Muestra por defecto los valores del semestre más reciente junto a su límite normativo. Con el selector se pueden consultar semestres anteriores, en modo de solo lectura. El catálogo está definido en [parametrosCatalogo.ts](../backend/shared/parametrosCatalogo.ts):

| Categoría | Parámetro | Límite |
|---|---|---|
| Calidad | Color | ≤ 15 Unidades Pt-Co |
| Calidad | Turbiedad | ≤ 5 UNT |
| Calidad | Sabor | Aceptable / sin sabor extraño |
| Calidad | Olor | Aceptable / sin olor extraño |
| Calidad | Coliformes | 0 UFC / 100 ml |
| Calidad | Plaguicidas | ≤ 0.03 – 0.1 mg/L |
| Calidad | Cianotoxinas | ≤ 1.0 µg/L (microcistina-LR) |
| Cantidad | Presión (red / domiciliaria) | 10 – 50 m.c.a. (1.0 – 5.0 bar) |

**Periodo.** La medición es semestral y se identifica como `2026-I` (enero a junio) o `2026-II` (julio a diciembre). La columna de la base de datos sigue llamándose `mes` porque la medición fue primero mensual y luego trimestral.

**Estados.** Cada fila tiene un estado: `ok` (Cumple), `alerta` (Fuera de rango) o `pendiente` (Sin registro). Una fila sin valor siempre está pendiente, y una con valor debe ser `ok` o `alerta`.

Al escribir un valor, el estado se sugiere comparándolo con el límite. La junta puede cambiarlo, y debe indicarlo si el valor no es un número simple, como `<1` o `3 bar`. Para esta sugerencia, los plaguicidas usan el extremo superior de su límite (0.1 mg/L), y la presión se interpreta en m.c.a.

**Publicación.** La junta edita la tabla como un borrador. Los cambios solo se envían al pulsar «Publicar cambios», y se guardan todos o ninguno.

**Semestre nuevo.** Cuando llega un semestre sin registrar, la junta ve el botón «Abrir semestre», que crea las filas vacías del catálogo.

### Costeo (`/costeo`)

Muestra los 10 componentes del costo anual del servicio, definidos en [costeoCatalogo.ts](../backend/shared/costeoCatalogo.ts). La junta edita la cantidad anual y el precio unitario de cada componente; los rubros y las unidades son fijos.

```text
costo anual de un componente = cantidad anual × precio unitario
total anual estimado = suma de los costos anuales
```

El total trata como 0 los valores vacíos.

### Tarifa (`/tarifa`)

La calculadora se ejecuta en el navegador y no guarda los datos ingresados.

```text
excedente  = máx(0, consumo − umbral)
subtotal   = cargo fijo + excedente × cargo variable
descuento  = cargo fijo × porcentaje ÷ 100, solo si la edad es de 65 años o más
total      = subtotal − descuento
```

El descuento se aplica sobre la tarifa fija, no sobre el total.

**Ejemplo.** Con los valores iniciales (cargo fijo $3.00, cargo variable $0.50/m³, umbral 10 m³, descuento 50 %), una persona de 70 años que consume 12 m³:

| Concepto | Cálculo | Valor |
|---|---|---|
| Tarifa fija | | $3.00 |
| Excedente | 2 m³ × $0.50 | $1.00 |
| Descuento | 50 % de $3.00 | −$1.50 |
| **Total** | | **$2.50** |

La junta y la entidad rectora pueden editar el cargo fijo, el cargo variable y el umbral desde esta página. El porcentaje de descuento solo se puede cambiar mediante la API.

### Fortalecimiento (`/fortalecimiento`)

Lista las capacitaciones que el rol puede ver. El contenido no está en la base de datos: se edita en [capacitaciones.ts](../backend/modules/fortalecimiento/capacitaciones.ts) y requiere volver a desplegar el backend. Para publicar una capacitación a todos, deja `rolesAcceso` como arreglo vacío.

Se pueden incrustar videos de YouTube y Vimeo. En una capacitación de tipo `video`, el enlace va en `contenido`; si está vacío, la página muestra «Video en preparación».

### Noticias (`/noticias`)

La junta publica noticias con título, resumen, contenido y listas de URL de imágenes y videos. Los archivos no se suben a la plataforma: deben estar alojados en otro sitio.

### Reportes de daños (`/reportes-danos`)

Cualquier persona puede reportar un daño sin iniciar sesión. El nombre y la descripción son obligatorios; la cédula, el medidor, el teléfono y la URL de una foto son opcionales.

La comunidad solo ve la fecha, la descripción y la foto. Los datos personales solo los ve la junta, que elimina los reportes cuando quedan resueltos; esa eliminación es definitiva. Como la descripción y la foto son públicas, conviene no incluir datos personales en ellas.

### Ingreso (`/ingreso`)

Formulario de correo y contraseña para las cuentas de la junta y de la entidad rectora. La sesión dura lo que indique `JWT_EXPIRES_IN` (8 horas por defecto). Al expirar, la aplicación cierra la sesión y muestra un aviso; los cambios sin publicar se pierden.

Se permiten 10 intentos fallidos cada 15 minutos por dirección IP.

## Limitaciones conocidas

- **Video de protocolos operativos:** todavía no tiene un enlace real, así que la página muestra «Video en preparación».
- **Imágenes y videos:** se enlazan por URL; la plataforma no aloja archivos.
- **Cuentas:** no hay interfaz para administrarlas ni para cambiar contraseñas. Un cambio de rol o una eliminación no afecta a los tokens ya emitidos hasta que expiran.
- **Pruebas:** el proyecto no tiene pruebas automatizadas ni CI.

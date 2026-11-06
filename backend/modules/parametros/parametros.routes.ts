import { Router } from 'express';
import type { ParametroMes } from '@prisma/client';
import { prisma } from '../../shared/prisma';
import { requireAuth, requireRole } from '../../middlewares/auth';
import { buscarEnCatalogo, CATALOGO_PARAMETROS } from '../../shared/parametrosCatalogo';

export const parametrosRouter = Router();

const FORMATO_SEMESTRE = /^\d{4}-(I|II)$/;

function conCatalogo(parametro: ParametroMes) {
  const catalogo = buscarEnCatalogo(parametro.nombre);
  return {
    ...parametro,
    opciones: catalogo?.opciones,
    opcionCumple: catalogo?.opcionCumple,
    min: catalogo?.min,
    max: catalogo?.max,
  };
}

parametrosRouter.get('/', async (req, res) => {
  const mes = typeof req.query.mes === 'string' ? req.query.mes : undefined;

  const parametros = await prisma.parametroMes.findMany({
    where: mes ? { mes } : undefined,
    orderBy: [{ mes: 'desc' }, { categoria: 'asc' }, { nombre: 'asc' }],
  });

  res.json(parametros.map(conCatalogo));
});

parametrosRouter.post('/', requireAuth, requireRole('JUNTA'), async (req, res) => {
  const { mes } = req.body ?? {};
  if (typeof mes !== 'string' || !FORMATO_SEMESTRE.test(mes)) {
    return res.status(400).json({ error: 'mes es requerido con formato de semestre, ej. "2026-I" o "2026-II"' });
  }

  const yaExiste = await prisma.parametroMes.findFirst({ where: { mes } });
  if (yaExiste) {
    return res.status(409).json({ error: `Ya existen parámetros registrados para el semestre ${mes}` });
  }

  const filas = await prisma.$transaction(
    CATALOGO_PARAMETROS.map((item) =>
      prisma.parametroMes.create({
        data: {
          mes,
          categoria: item.categoria,
          nombre: item.nombre,
          limite: item.limite,
          valor: '',
          estado: 'pendiente',
          creadoPorId: req.user!.sub,
        },
      }),
    ),
  );

  res.status(201).json(filas.map(conCatalogo));
});

/** Actualiza varias filas en una sola transacción: se guardan todas o ninguna. */
parametrosRouter.put('/', requireAuth, requireRole('JUNTA'), async (req, res) => {
  const { filas } = req.body ?? {};
  if (!Array.isArray(filas) || filas.length === 0) {
    return res.status(400).json({ error: 'filas es requerido y no puede estar vacío' });
  }

  for (const fila of filas) {
    if (typeof fila?.id !== 'string' || typeof fila.valor !== 'string' || typeof fila.estado !== 'string') {
      return res.status(400).json({ error: 'Cada fila requiere id, valor y estado' });
    }
    if (!['ok', 'alerta', 'pendiente'].includes(fila.estado)) {
      return res.status(400).json({ error: 'estado debe ser "ok", "alerta" o "pendiente"' });
    }
  }

  const ids: string[] = filas.map((fila) => fila.id);
  const existentes = await prisma.parametroMes.findMany({ where: { id: { in: ids } } });
  const porId = new Map(existentes.map((p) => [p.id, p]));

  for (const fila of filas) {
    const existente = porId.get(fila.id);
    if (!existente) {
      return res.status(404).json({ error: 'Parámetro no encontrado' });
    }

    const vacio = fila.valor.trim() === '';
    const opciones = buscarEnCatalogo(existente.nombre)?.opciones;
    if (opciones && !vacio && !opciones.includes(fila.valor)) {
      return res.status(400).json({ error: `${existente.nombre}: valor debe ser una de: ${opciones.join(', ')}` });
    }
    if (vacio !== (fila.estado === 'pendiente')) {
      return res.status(400).json({
        error: `${existente.nombre}: una medición con valor debe marcarse como "ok" o "alerta", y una sin valor como "pendiente"`,
      });
    }
  }

  const publicadoEn = new Date();
  const actualizados = await prisma.$transaction(
    filas.map((fila) =>
      prisma.parametroMes.update({
        where: { id: fila.id },
        data: { valor: fila.valor, estado: fila.estado, publicadoEn },
      }),
    ),
  );

  res.json(actualizados.map(conCatalogo));
});

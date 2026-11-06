import { Router } from 'express';
import { prisma } from '../../shared/prisma';
import { requireAuth, requireRole } from '../../middlewares/auth';
import { aNumeroNoNegativo } from '../../shared/validacion';

export const costeoRouter = Router();

const CAMPOS_NUMERICOS = ['cantidadAnual', 'precioUnitario'] as const;

costeoRouter.get('/', async (_req, res) => {
  const filas = await prisma.costeoComponente.findMany({ orderBy: { orden: 'asc' } });
  res.json(filas);
});

/** Actualiza varias filas en una sola transacción: se guardan todas o ninguna. */
costeoRouter.put('/', requireAuth, requireRole('JUNTA'), async (req, res) => {
  const { filas } = req.body ?? {};
  if (!Array.isArray(filas) || filas.length === 0) {
    return res.status(400).json({ error: 'filas es requerido y no puede estar vacío' });
  }

  const cambios: { id: string; data: Record<string, number | null> }[] = [];
  for (const fila of filas) {
    if (typeof fila?.id !== 'string') {
      return res.status(400).json({ error: 'Cada fila requiere id' });
    }

    const data: Record<string, number | null> = {};
    for (const campo of CAMPOS_NUMERICOS) {
      if (fila[campo] === undefined) continue;
      const numero = fila[campo] === null ? null : aNumeroNoNegativo(fila[campo]);
      if (fila[campo] !== null && numero === null) {
        return res.status(400).json({ error: 'cantidadAnual y precioUnitario deben ser números mayores o iguales a 0' });
      }
      data[campo] = numero;
    }
    cambios.push({ id: fila.id, data });
  }

  const ids = cambios.map((cambio) => cambio.id);
  const existentes = await prisma.costeoComponente.count({ where: { id: { in: ids } } });
  if (existentes !== new Set(ids).size) {
    return res.status(404).json({ error: 'Componente de costeo no encontrado' });
  }

  const actualizados = await prisma.$transaction(
    cambios.map(({ id, data }) =>
      prisma.costeoComponente.update({
        where: { id },
        data: { ...data, actualizadoPorId: req.user!.sub },
      }),
    ),
  );

  res.json(actualizados);
});

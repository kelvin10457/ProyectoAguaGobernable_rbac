import { Router } from 'express';
import { prisma } from '../../shared/prisma';
import { requireAuth, requireRole } from '../../middlewares/auth';

export const costeoRouter = Router();

costeoRouter.get('/', async (_req, res) => {
  const filas = await prisma.costeoComponente.findMany({ orderBy: { orden: 'asc' } });
  res.json(filas);
});

costeoRouter.put('/:id', requireAuth, requireRole('JUNTA'), async (req, res) => {
  const { id } = req.params as { id: string };
  const { cantidadAnual, precioUnitario } = req.body ?? {};

  const data: Record<string, number | null> = {};
  if (cantidadAnual !== undefined) data.cantidadAnual = cantidadAnual === null ? null : Number(cantidadAnual);
  if (precioUnitario !== undefined) data.precioUnitario = precioUnitario === null ? null : Number(precioUnitario);

  if (Object.values(data).some((v) => v !== null && Number.isNaN(v))) {
    return res.status(400).json({ error: 'cantidadAnual y precioUnitario deben ser numéricos' });
  }

  const existente = await prisma.costeoComponente.findUnique({ where: { id } });
  if (!existente) {
    return res.status(404).json({ error: 'Componente de costeo no encontrado' });
  }

  const actualizado = await prisma.costeoComponente.update({
    where: { id },
    data: { ...data, actualizadoPorId: req.user!.sub },
  });

  res.json(actualizado);
});

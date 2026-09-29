import { Router } from 'express';
import { prisma } from '../../shared/prisma';
import { requireAuth, requireRole } from '../../middlewares/auth';

export const reportesDanosRouter = Router();

reportesDanosRouter.get('/', async (_req, res) => {
  const reportes = await prisma.reporteDano.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(reportes);
});

reportesDanosRouter.post('/', async (req, res) => {
  const body = req.body ?? {};
  const { nombre, telefono, descripcion, imagenUrl } = body;

  if (typeof nombre !== 'string' || !nombre.trim() || typeof descripcion !== 'string' || !descripcion.trim()) {
    return res.status(400).json({ error: 'El nombre y la descripción del daño son obligatorios' });
  }

  const creado = await prisma.reporteDano.create({
    data: {
      nombre: nombre.trim(),
      telefono: typeof telefono === 'string' && telefono.trim() ? telefono.trim() : null,
      descripcion: descripcion.trim(),
      imagenUrl: typeof imagenUrl === 'string' && imagenUrl.trim() ? imagenUrl.trim() : null,
    },
  });

  res.status(201).json(creado);
});

reportesDanosRouter.delete('/:id', requireAuth, requireRole('JUNTA'), async (req, res) => {
  const { id } = req.params as { id: string };
  try {
    await prisma.reporteDano.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Reporte no encontrado' });
  }
});

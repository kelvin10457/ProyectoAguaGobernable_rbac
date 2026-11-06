import { Router } from 'express';
import { esRegistroNoEncontrado, prisma } from '../../shared/prisma';
import { attachUserIfPresent, requireAuth, requireRole } from '../../middlewares/auth';
import { limiteReportes } from '../../middlewares/rateLimit';

export const reportesDanosRouter = Router();

/** Campos visibles para la comunidad. Nombre, cédula, medidor y teléfono solo los ve la junta. */
const CAMPOS_PUBLICOS = { id: true, descripcion: true, imagenUrl: true, createdAt: true } as const;

function textoOpcional(valor: unknown): string | null {
  return typeof valor === 'string' && valor.trim() ? valor.trim() : null;
}

function esUrlWeb(valor: string): boolean {
  try {
    return ['http:', 'https:'].includes(new URL(valor).protocol);
  } catch {
    return false;
  }
}

reportesDanosRouter.get('/', attachUserIfPresent, async (req, res) => {
  const reportes = await prisma.reporteDano.findMany({
    orderBy: { createdAt: 'desc' },
    select: req.user?.role === 'JUNTA' ? undefined : CAMPOS_PUBLICOS,
  });
  res.json(reportes);
});

reportesDanosRouter.post('/', limiteReportes, attachUserIfPresent, async (req, res) => {
  const body = req.body ?? {};
  const { nombre, cedula, medidor, telefono, descripcion, imagenUrl } = body;

  if (typeof nombre !== 'string' || !nombre.trim() || typeof descripcion !== 'string' || !descripcion.trim()) {
    return res.status(400).json({ error: 'El nombre y la descripción del daño son obligatorios' });
  }

  const imagen = textoOpcional(imagenUrl);
  if (imagen && !esUrlWeb(imagen)) {
    return res.status(400).json({ error: 'La foto debe ser una URL que empiece con http:// o https://' });
  }

  const creado = await prisma.reporteDano.create({
    data: {
      nombre: nombre.trim(),
      cedula: textoOpcional(cedula),
      medidor: textoOpcional(medidor),
      telefono: textoOpcional(telefono),
      descripcion: descripcion.trim(),
      imagenUrl: imagen,
    },
    select: req.user?.role === 'JUNTA' ? undefined : CAMPOS_PUBLICOS,
  });

  res.status(201).json(creado);
});

reportesDanosRouter.delete('/:id', requireAuth, requireRole('JUNTA'), async (req, res) => {
  const { id } = req.params as { id: string };
  try {
    await prisma.reporteDano.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (!esRegistroNoEncontrado(err)) throw err;
    res.status(404).json({ error: 'Reporte no encontrado' });
  }
});

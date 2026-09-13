import { Router } from 'express';
import { attachUserIfPresent } from '../../middlewares/auth';
import { CAPACITACIONES, puedeAcceder } from './capacitaciones';

export const fortalecimientoRouter = Router();

fortalecimientoRouter.get('/', attachUserIfPresent, (req, res) => {
  const visibles = CAPACITACIONES.filter((c) => puedeAcceder(c, req.user?.role)).map(({ slug, titulo, tipo }) => ({
    slug,
    titulo,
    tipo,
  }));
  res.json(visibles);
});

fortalecimientoRouter.get('/:slug', attachUserIfPresent, (req, res) => {
  const capacitacion = CAPACITACIONES.find((c) => c.slug === req.params.slug);
  if (!capacitacion || !puedeAcceder(capacitacion, req.user?.role)) {
    return res.status(404).json({ error: 'Capacitación no encontrada' });
  }
  res.json(capacitacion);
});

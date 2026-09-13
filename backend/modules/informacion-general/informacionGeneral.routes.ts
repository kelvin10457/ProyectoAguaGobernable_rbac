import { Router } from 'express';
import { prisma } from '../../shared/prisma';
import { requireAuth, requireRole } from '../../middlewares/auth';

export const informacionGeneralRouter = Router();

const CAMPOS_EDITABLES = [
  'familias',
  'habitantes',
  'localidadesAtendidas',
  'canton',
  'provincia',
  'zonaUtm',
  'coordenadaEste',
  'coordenadaSur',
  'cota',
  'presidente',
  'telefonoContacto',
  'horarioAtencion',
  'fotoUrl',
  'mapaUrl',
] as const;

informacionGeneralRouter.get('/', async (_req, res) => {
  const info = await prisma.informacionGeneral.findFirst();
  if (!info) {
    return res.status(404).json({ error: 'Información general aún no configurada' });
  }
  res.json(info);
});

informacionGeneralRouter.put('/', requireAuth, requireRole('JUNTA'), async (req, res) => {
  const body = req.body ?? {};
  const data: Record<string, unknown> = {};
  for (const campo of CAMPOS_EDITABLES) {
    if (campo in body) data[campo] = body[campo];
  }

  const existente = await prisma.informacionGeneral.findFirst();

  const actualizado = existente
    ? await prisma.informacionGeneral.update({
        where: { id: existente.id },
        data: { ...data, actualizadoPorId: req.user!.sub },
      })
    : await prisma.informacionGeneral.create({
        data: {
          familias: 0,
          habitantes: 0,
          localidadesAtendidas: '',
          canton: '',
          provincia: '',
          zonaUtm: '',
          coordenadaEste: '',
          coordenadaSur: '',
          cota: '',
          presidente: '',
          telefonoContacto: '',
          horarioAtencion: '',
          ...data,
          actualizadoPorId: req.user!.sub,
        },
      });

  res.json(actualizado);
});

import { Router } from 'express';
import { prisma } from '../../shared/prisma';
import { requireAuth, requireRole } from '../../middlewares/auth';
import { aNumeroNoNegativo } from '../../shared/validacion';

export const tarifaRouter = Router();

tarifaRouter.get('/config', async (_req, res) => {
  const config = await prisma.tarifaConfig.findFirst();
  if (!config) {
    return res.status(404).json({ error: 'Tarifa aún no configurada' });
  }
  res.json(config);
});

tarifaRouter.put('/config', requireAuth, requireRole('JUNTA', 'ENTIDAD_RECTORA'), async (req, res) => {
  const body = req.body ?? {};

  const data: Record<string, number> = {};
  for (const campo of ['cargoFijo', 'cargoVariable', 'umbralConsumo', 'descuentoAdultoMayorPct']) {
    if (body[campo] === undefined) continue;
    const numero = aNumeroNoNegativo(body[campo]);
    if (numero === null) {
      return res.status(400).json({ error: 'Los campos de tarifa deben ser números mayores o iguales a 0' });
    }
    data[campo] = numero;
  }

  if (data.descuentoAdultoMayorPct > 100) {
    return res.status(400).json({ error: 'El descuento no puede superar el 100 %' });
  }

  const existente = await prisma.tarifaConfig.findFirst();

  const actualizado = existente
    ? await prisma.tarifaConfig.update({
        where: { id: existente.id },
        data: { ...data, vigenteDesde: new Date(), actualizadoPorId: req.user!.sub },
      })
    : await prisma.tarifaConfig.create({
        data: {
          cargoFijo: 3,
          cargoVariable: 0.5,
          umbralConsumo: 10,
          descuentoAdultoMayorPct: 50,
          ...data,
          actualizadoPorId: req.user!.sub,
        },
      });

  res.json(actualizado);
});

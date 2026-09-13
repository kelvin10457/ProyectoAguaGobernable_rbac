import { Router } from 'express';
import { prisma } from '../../shared/prisma';
import { requireAuth, requireRole } from '../../middlewares/auth';

export const tarifaRouter = Router();

tarifaRouter.get('/config', async (_req, res) => {
  const config = await prisma.tarifaConfig.findFirst();
  if (!config) {
    return res.status(404).json({ error: 'Tarifa aún no configurada' });
  }
  res.json(config);
});

tarifaRouter.put('/config', requireAuth, requireRole('JUNTA', 'ENTIDAD_RECTORA'), async (req, res) => {
  const { cargoFijo, cargoVariable, umbralConsumo, descuentoAdultoMayorPct } = req.body ?? {};

  const data: Record<string, unknown> = {};
  if (cargoFijo !== undefined) data.cargoFijo = Number(cargoFijo);
  if (cargoVariable !== undefined) data.cargoVariable = Number(cargoVariable);
  if (umbralConsumo !== undefined) data.umbralConsumo = Number(umbralConsumo);
  if (descuentoAdultoMayorPct !== undefined) data.descuentoAdultoMayorPct = Number(descuentoAdultoMayorPct);

  if (Object.values(data).some((v) => typeof v === 'number' && Number.isNaN(v))) {
    return res.status(400).json({ error: 'Los campos de tarifa deben ser numéricos' });
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

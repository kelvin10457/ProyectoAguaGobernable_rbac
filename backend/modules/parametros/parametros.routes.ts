import { Router } from 'express';
import { prisma } from '../../shared/prisma';
import { requireAuth, requireRole } from '../../middlewares/auth';
import { buscarEnCatalogo, CATALOGO_PARAMETROS } from '../../shared/parametrosCatalogo';

export const parametrosRouter = Router();

parametrosRouter.get('/', async (req, res) => {
  const mes = typeof req.query.mes === 'string' ? req.query.mes : undefined;

  const parametros = await prisma.parametroMes.findMany({
    where: mes ? { mes } : undefined,
    orderBy: [{ mes: 'desc' }, { categoria: 'asc' }, { nombre: 'asc' }],
  });

  res.json(parametros.map((p: (typeof parametros)[number]) => ({ ...p, opciones: buscarEnCatalogo(p.nombre)?.opciones })));
});

parametrosRouter.post('/', requireAuth, requireRole('JUNTA'), async (req, res) => {
  const { mes } = req.body ?? {};
  if (typeof mes !== 'string' || !mes) {
    return res.status(400).json({ error: 'mes es requerido, ej. "2026-I" (semestre)' });
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

  res.status(201).json(filas);
});

parametrosRouter.put('/:id', requireAuth, requireRole('JUNTA'), async (req, res) => {
  const { id } = req.params as { id: string };
  const { valor, estado } = req.body ?? {};

  if (typeof valor !== 'string' || typeof estado !== 'string') {
    return res.status(400).json({ error: 'valor y estado son requeridos' });
  }
  if (!['ok', 'alerta', 'pendiente'].includes(estado)) {
    return res.status(400).json({ error: 'estado debe ser "ok", "alerta" o "pendiente"' });
  }

  const existente = await prisma.parametroMes.findUnique({ where: { id } });
  if (!existente) {
    return res.status(404).json({ error: 'Parámetro no encontrado' });
  }

  const opciones = buscarEnCatalogo(existente.nombre)?.opciones;
  if (opciones && valor.trim() !== '' && !opciones.includes(valor)) {
    return res.status(400).json({ error: `valor debe ser una de: ${opciones.join(', ')}` });
  }

  const actualizado = await prisma.parametroMes.update({
    where: { id },
    data: { valor, estado, publicadoEn: new Date() },
  });

  res.json(actualizado);
});

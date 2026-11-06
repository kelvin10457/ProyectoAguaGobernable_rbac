import { Router } from 'express';
import { esRegistroNoEncontrado, prisma } from '../../shared/prisma';
import { requireAuth, requireRole } from '../../middlewares/auth';

export const noticiasRouter = Router();

const CAMPOS_EDITABLES = ['titulo', 'resumen', 'contenido', 'imagenesUrl', 'videosUrl'] as const;
const CAMPOS_LISTA = ['imagenesUrl', 'videosUrl'] as const;

function normalizarDatos(body: Record<string, unknown>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const campo of CAMPOS_EDITABLES) {
    if (!(campo in body)) continue;
    if ((CAMPOS_LISTA as readonly string[]).includes(campo)) {
      const lista = body[campo];
      data[campo] = Array.isArray(lista)
        ? lista.filter((url): url is string => typeof url === 'string' && url.trim() !== '')
        : [];
    } else {
      data[campo] = body[campo];
    }
  }
  return data;
}

function errorDeTextos(data: Record<string, unknown>): string | null {
  for (const campo of ['titulo', 'contenido']) {
    if (campo in data && (typeof data[campo] !== 'string' || !data[campo].trim())) {
      return 'El título y el contenido deben ser texto y no pueden estar vacíos';
    }
  }
  if ('resumen' in data && data.resumen !== null && typeof data.resumen !== 'string') {
    return 'El resumen debe ser texto';
  }
  return null;
}

noticiasRouter.get('/', async (_req, res) => {
  const noticias = await prisma.noticia.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(noticias);
});

noticiasRouter.get('/:id', async (req, res) => {
  const noticia = await prisma.noticia.findUnique({ where: { id: req.params.id } });
  if (!noticia) {
    return res.status(404).json({ error: 'Noticia no encontrada' });
  }
  res.json(noticia);
});

noticiasRouter.post('/', requireAuth, requireRole('JUNTA'), async (req, res) => {
  const body = req.body ?? {};
  if (!body.titulo || !body.contenido) {
    return res.status(400).json({ error: 'El título y el contenido son obligatorios' });
  }

  const data = normalizarDatos(body);
  const error = errorDeTextos(data);
  if (error) return res.status(400).json({ error });

  const creada = await prisma.noticia.create({
    data: { ...data, titulo: body.titulo, contenido: body.contenido, creadoPorId: req.user!.sub },
  });

  res.status(201).json(creada);
});

noticiasRouter.put('/:id', requireAuth, requireRole('JUNTA'), async (req, res) => {
  const { id } = req.params as { id: string };
  const data = normalizarDatos(req.body ?? {});
  const error = errorDeTextos(data);
  if (error) return res.status(400).json({ error });

  try {
    const actualizada = await prisma.noticia.update({
      where: { id },
      data: { ...data, actualizadoPorId: req.user!.sub },
    });
    res.json(actualizada);
  } catch (err) {
    if (!esRegistroNoEncontrado(err)) throw err;
    res.status(404).json({ error: 'Noticia no encontrada' });
  }
});

noticiasRouter.delete('/:id', requireAuth, requireRole('JUNTA'), async (req, res) => {
  const { id } = req.params as { id: string };
  try {
    await prisma.noticia.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    if (!esRegistroNoEncontrado(err)) throw err;
    res.status(404).json({ error: 'Noticia no encontrada' });
  }
});

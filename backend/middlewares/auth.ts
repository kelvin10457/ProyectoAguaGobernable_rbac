import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@prisma/client';
import { verifyToken, type JwtPayload } from '../shared/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim() || null;
}

/** Adjunta `req.user` si viene un token válido, sin bloquear la petición. Úsalo en rutas públicas cuya respuesta varía según el rol. */
export function attachUserIfPresent(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      // token ausente o inválido: se trata como visitante anónimo (rol "usuario")
    }
  }
  next();
}

/** Exige un token válido. Debe ir antes de requireRole. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

/** Exige que req.user.role esté en la lista de roles permitidos. Usar después de requireAuth. */
export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permiso para esta acción' });
    }
    next();
  };
}

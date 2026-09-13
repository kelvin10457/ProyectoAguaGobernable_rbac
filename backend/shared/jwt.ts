import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Falta la variable de entorno JWT_SECRET');
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '8h';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  nombre: string | null;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  nombre: string | null;
}

export function signToken(user: AuthUser): string {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    nombre: user.nombre,
  };
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET as string) as JwtPayload;
}

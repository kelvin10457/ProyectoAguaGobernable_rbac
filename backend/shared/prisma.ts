import { Prisma, PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

/** Indica si Prisma falló porque el registro a modificar o eliminar no existe. */
export function esRegistroNoEncontrado(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025';
}

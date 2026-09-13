import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../shared/prisma';
import { signToken } from '../../shared/jwt';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ error: 'email y password son requeridos' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const passwordOk = await bcrypt.compare(password, user.passwordHash);
  if (!passwordOk) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role, nombre: user.nombre });

  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role, nombre: user.nombre },
  });
});

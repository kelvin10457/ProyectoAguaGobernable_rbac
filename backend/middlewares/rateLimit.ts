import { rateLimit } from 'express-rate-limit';

const QUINCE_MINUTOS = 15 * 60 * 1000;
const UNA_HORA = 60 * 60 * 1000;

/** Solo cuenta los intentos fallidos, para frenar la prueba de contraseñas sin afectar a quien ingresa bien. */
export const limiteLogin = rateLimit({
  windowMs: QUINCE_MINUTOS,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de ingreso. Espera unos minutos e inténtalo de nuevo.' },
});

export const limiteReportes = rateLimit({
  windowMs: UNA_HORA,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Se enviaron demasiados reportes. Espera un momento e inténtalo de nuevo.' },
});

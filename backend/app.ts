import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes';
import { informacionGeneralRouter } from './modules/informacion-general/informacionGeneral.routes';
import { parametrosRouter } from './modules/parametros/parametros.routes';
import { tarifaRouter } from './modules/tarifa/tarifa.routes';
import { fortalecimientoRouter } from './modules/fortalecimiento/fortalecimiento.routes';
import { costeoRouter } from './modules/costeo/costeo.routes';
import { noticiasRouter } from './modules/noticias/noticias.routes';
import { reportesDanosRouter } from './modules/reportes-danos/reportesDanos.routes';

/** Orígenes de Vite en desarrollo. Sin CORS_ORIGIN no se abre el acceso a cualquier sitio. */
const ORIGENES_DESARROLLO = ['http://localhost:5173', 'http://localhost:4173'];

export const app = express();

// Número de proxies delante del servidor; necesario para que el límite de peticiones identifique la IP real.
app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS ?? 0));

app.use(cors({ origin: process.env.CORS_ORIGIN || ORIGENES_DESARROLLO }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRouter);
app.use('/informacion-general', informacionGeneralRouter);
app.use('/parametros', parametrosRouter);
app.use('/tarifa', tarifaRouter);
app.use('/fortalecimiento', fortalecimientoRouter);
app.use('/costeo', costeoRouter);
app.use('/noticias', noticiasRouter);
app.use('/reportes-danos', reportesDanosRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err: { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status ?? 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? 'Error interno del servidor' : 'Solicitud inválida' });
});

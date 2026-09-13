import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes';
import { informacionGeneralRouter } from './modules/informacion-general/informacionGeneral.routes';
import { parametrosRouter } from './modules/parametros/parametros.routes';
import { tarifaRouter } from './modules/tarifa/tarifa.routes';
import { fortalecimientoRouter } from './modules/fortalecimiento/fortalecimiento.routes';
import { costeoRouter } from './modules/costeo/costeo.routes';

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRouter);
app.use('/informacion-general', informacionGeneralRouter);
app.use('/parametros', parametrosRouter);
app.use('/tarifa', tarifaRouter);
app.use('/fortalecimiento', fortalecimientoRouter);
app.use('/costeo', costeoRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

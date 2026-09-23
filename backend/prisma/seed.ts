import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { CATALOGO_PARAMETROS } from '../shared/parametrosCatalogo';
import { CATALOGO_COSTEO } from '../shared/costeoCatalogo';
import { semestreActual } from '../shared/periodo';

const prisma = new PrismaClient();

async function seedUsuarios() {
  const cuentas = [
    {
      role: 'JUNTA' as const,
      email: process.env.SEED_JUNTA_EMAIL ?? 'junta@limonhavoline.test',
      password: process.env.SEED_JUNTA_PASSWORD ?? 'junta12345',
      nombre: 'Directiva JAAP El Limón–Havoline',
    },
    {
      role: 'ENTIDAD_RECTORA' as const,
      email: process.env.SEED_ENTIDAD_RECTORA_EMAIL ?? 'entidadrectora@limonhavoline.test',
      password: process.env.SEED_ENTIDAD_RECTORA_PASSWORD ?? 'entidad12345',
      nombre: 'Entidad Rectora',
    },
  ];

  for (const cuenta of cuentas) {
    const passwordHash = await bcrypt.hash(cuenta.password, 10);
    await prisma.user.upsert({
      where: { email: cuenta.email },
      update: { passwordHash, role: cuenta.role, nombre: cuenta.nombre },
      create: { email: cuenta.email, passwordHash, role: cuenta.role, nombre: cuenta.nombre },
    });
    console.log(`Usuario listo: ${cuenta.email} (${cuenta.role})`);
  }
}

async function seedInformacionGeneral() {
  const existente = await prisma.informacionGeneral.findFirst();
  if (existente) return;

  await prisma.informacionGeneral.create({
    data: {
      familias: 525,
      habitantes: 2100,
      localidadesAtendidas: 'El Limón y Havoline',
      canton: 'Empalme',
      provincia: 'Guayas',
      zonaUtm: '17M',
      coordenadaEste: '649 475 E',
      coordenadaSur: '9 884 875 S',
      cota: '74 m.s.n.m.',
      presidente: 'Alberto Montoya Zamora',
      telefonoContacto: '098 896 0736',
      horarioAtencion: 'Lun a vie, 08:00–13:00',
    },
  });
  console.log('Información general inicial creada');
}

async function seedTarifaConfig() {
  const existente = await prisma.tarifaConfig.findFirst();
  if (existente) return;

  await prisma.tarifaConfig.create({
    data: { cargoFijo: 3, cargoVariable: 0.5, umbralConsumo: 10, descuentoAdultoMayorPct: 50 },
  });
  console.log('Configuración de tarifa inicial creada');
}

const VALORES_INICIALES: Record<string, { valor: string; estado: string }> = {
  Color: { valor: '8', estado: 'ok' },
  Turbiedad: { valor: '2.1', estado: 'ok' },
  Sabor: { valor: 'Aceptable', estado: 'ok' },
  Olor: { valor: 'Aceptable', estado: 'ok' },
  Coliformes: { valor: '0', estado: 'ok' },
  Plaguicidas: { valor: '0.01', estado: 'ok' },
  Cianotoxinas: { valor: '', estado: 'pendiente' },
  'Presión (red / domiciliaria)': { valor: '8', estado: 'alerta' },
};

async function seedParametros() {
  const mes = semestreActual(); // "YYYY-I" o "YYYY-II"
  const existente = await prisma.parametroMes.findFirst({ where: { mes } });
  if (existente) return;

  await prisma.$transaction(
    CATALOGO_PARAMETROS.map((item) => {
      const inicial = VALORES_INICIALES[item.nombre] ?? { valor: '', estado: 'pendiente' };
      return prisma.parametroMes.create({
        data: {
          mes,
          categoria: item.categoria,
          nombre: item.nombre,
          limite: item.limite,
          valor: inicial.valor,
          estado: inicial.estado,
          publicadoEn: new Date(),
        },
      });
    }),
  );
  console.log(`Parámetros iniciales creados para el mes ${mes}`);
}

async function seedCosteo() {
  const existente = await prisma.costeoComponente.findFirst();
  if (existente) return;

  await prisma.$transaction(
    CATALOGO_COSTEO.map((item) =>
      prisma.costeoComponente.create({
        data: {
          orden: item.orden,
          componente: item.componente,
          rubro: item.rubro,
          unidad: item.unidad,
          cantidadAnual: item.cantidadAnualDefault ?? null,
        },
      }),
    ),
  );
  console.log('Costeo del servicio inicial creado');
}

async function main() {
  await seedUsuarios();
  await seedInformacionGeneral();
  await seedTarifaConfig();
  await seedParametros();
  await seedCosteo();
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

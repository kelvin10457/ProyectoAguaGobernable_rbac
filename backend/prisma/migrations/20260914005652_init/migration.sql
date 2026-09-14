-- CreateEnum
CREATE TYPE "Role" AS ENUM ('JUNTA', 'ENTIDAD_RECTORA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "nombre" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InformacionGeneral" (
    "id" TEXT NOT NULL,
    "familias" INTEGER NOT NULL,
    "habitantes" INTEGER NOT NULL,
    "localidadesAtendidas" TEXT NOT NULL,
    "canton" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "zonaUtm" TEXT NOT NULL,
    "coordenadaEste" TEXT NOT NULL,
    "coordenadaSur" TEXT NOT NULL,
    "cota" TEXT NOT NULL,
    "presidente" TEXT NOT NULL,
    "telefonoContacto" TEXT NOT NULL,
    "horarioAtencion" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "mapaUrl" TEXT,
    "actualizadoPorId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InformacionGeneral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParametroMes" (
    "id" TEXT NOT NULL,
    "mes" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "limite" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "publicadoEn" TIMESTAMP(3),
    "creadoPorId" TEXT,

    CONSTRAINT "ParametroMes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TarifaConfig" (
    "id" TEXT NOT NULL,
    "cargoFijo" DOUBLE PRECISION NOT NULL,
    "cargoVariable" DOUBLE PRECISION NOT NULL,
    "umbralConsumo" DOUBLE PRECISION NOT NULL,
    "descuentoAdultoMayorPct" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "vigenteDesde" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoPorId" TEXT,

    CONSTRAINT "TarifaConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CosteoComponente" (
    "id" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "componente" TEXT NOT NULL,
    "rubro" TEXT NOT NULL,
    "unidad" TEXT NOT NULL,
    "cantidadAnual" DOUBLE PRECISION,
    "precioUnitario" DOUBLE PRECISION,
    "actualizadoPorId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CosteoComponente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ParametroMes_mes_idx" ON "ParametroMes"("mes");

-- CreateIndex
CREATE UNIQUE INDEX "ParametroMes_mes_categoria_nombre_key" ON "ParametroMes"("mes", "categoria", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "CosteoComponente_orden_key" ON "CosteoComponente"("orden");

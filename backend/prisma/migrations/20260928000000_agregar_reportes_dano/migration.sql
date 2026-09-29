-- CreateTable
CREATE TABLE "ReporteDano" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "descripcion" TEXT NOT NULL,
    "imagenUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReporteDano_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReporteDano_createdAt_idx" ON "ReporteDano"("createdAt");

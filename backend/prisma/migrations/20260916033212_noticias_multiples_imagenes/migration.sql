/*
  Warnings:

  - You are about to drop the column `imagenUrl` on the `Noticia` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Noticia" DROP COLUMN "imagenUrl",
ADD COLUMN     "imagenesUrl" TEXT[] DEFAULT ARRAY[]::TEXT[];

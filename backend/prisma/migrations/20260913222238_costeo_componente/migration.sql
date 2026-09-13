-- CreateTable
CREATE TABLE `CosteoComponente` (
    `id` VARCHAR(191) NOT NULL,
    `orden` INTEGER NOT NULL,
    `componente` VARCHAR(191) NOT NULL,
    `rubro` VARCHAR(191) NOT NULL,
    `unidad` VARCHAR(191) NOT NULL,
    `cantidadAnual` DOUBLE NULL,
    `precioUnitario` DOUBLE NULL,
    `actualizadoPorId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CosteoComponente_orden_key`(`orden`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

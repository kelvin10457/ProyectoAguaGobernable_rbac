-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('JUNTA', 'ENTIDAD_RECTORA') NOT NULL,
    `nombre` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InformacionGeneral` (
    `id` VARCHAR(191) NOT NULL,
    `familias` INTEGER NOT NULL,
    `habitantes` INTEGER NOT NULL,
    `localidadesAtendidas` VARCHAR(191) NOT NULL,
    `canton` VARCHAR(191) NOT NULL,
    `provincia` VARCHAR(191) NOT NULL,
    `zonaUtm` VARCHAR(191) NOT NULL,
    `coordenadaEste` VARCHAR(191) NOT NULL,
    `coordenadaSur` VARCHAR(191) NOT NULL,
    `cota` VARCHAR(191) NOT NULL,
    `presidente` VARCHAR(191) NOT NULL,
    `telefonoContacto` VARCHAR(191) NOT NULL,
    `horarioAtencion` VARCHAR(191) NOT NULL,
    `fotoUrl` VARCHAR(191) NULL,
    `mapaUrl` VARCHAR(191) NULL,
    `actualizadoPorId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParametroMes` (
    `id` VARCHAR(191) NOT NULL,
    `mes` VARCHAR(191) NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `limite` VARCHAR(191) NOT NULL,
    `valor` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `publicadoEn` DATETIME(3) NULL,
    `creadoPorId` VARCHAR(191) NULL,

    INDEX `ParametroMes_mes_idx`(`mes`),
    UNIQUE INDEX `ParametroMes_mes_categoria_nombre_key`(`mes`, `categoria`, `nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TarifaConfig` (
    `id` VARCHAR(191) NOT NULL,
    `cargoFijo` DOUBLE NOT NULL,
    `cargoVariable` DOUBLE NOT NULL,
    `umbralConsumo` DOUBLE NOT NULL,
    `descuentoAdultoMayorPct` DOUBLE NOT NULL DEFAULT 50,
    `vigenteDesde` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoPorId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

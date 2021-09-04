-- CreateTable
CREATE TABLE `PeakElectricity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `areaId` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `expectedHour` VARCHAR(191) NOT NULL,
    `type` ENUM('AMOUNT', 'PERCENTAGE') NOT NULL,
    `percentage` INTEGER NOT NULL,
    `reservePct` INTEGER,
    `isTomorrow` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `PeakElectricity.areaId_type_date_unique`(`areaId`, `type`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HourlyDemand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `areaId` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `hour` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `supply` INTEGER NOT NULL,
    `percentage` INTEGER NOT NULL,

    INDEX `HourlyDemand.areaId_date_index`(`areaId`, `date`),
    UNIQUE INDEX `HourlyDemand.areaId_date_hour_unique`(`areaId`, `date`, `hour`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FiveMinDemand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `areaId` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `solar` INTEGER,

    INDEX `FiveMinDemand.areaId_date_index`(`areaId`, `date`),
    UNIQUE INDEX `FiveMinDemand.areaId_date_time_unique`(`areaId`, `date`, `time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PeakElectricity` ADD FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HourlyDemand` ADD FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FiveMinDemand` ADD FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE `Area` ADD COLUMN `hasWindData` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `FiveMinDemand` ADD COLUMN `wind` INTEGER;

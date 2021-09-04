/*
  Warnings:

  - Added the required column `amount` to the `PeakElectricity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `predictDate` to the `PeakElectricity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supply` to the `PeakElectricity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PeakElectricity` ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `predictDate` DATETIME(3) NOT NULL,
    ADD COLUMN `supply` INTEGER NOT NULL;

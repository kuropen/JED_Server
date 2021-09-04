-- CreateTable
CREATE TABLE `Area` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `longName` VARCHAR(191) NOT NULL,
    `officialWeb` VARCHAR(191) NOT NULL,
    `csvFile` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Area.code_unique`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

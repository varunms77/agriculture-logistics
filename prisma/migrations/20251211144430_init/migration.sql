/*
  Warnings:

  - You are about to drop the column `batchHash` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `product` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `qrCode` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `totalQty` on the `batch` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `eventHash` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `previousEventHash` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `event` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `Batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `farmName` to the `Batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `Batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `Batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weightUnit` to the `Batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actor` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventType` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Batch_qrCode_key` ON `batch`;

-- AlterTable
ALTER TABLE `batch` DROP COLUMN `batchHash`,
    DROP COLUMN `product`,
    DROP COLUMN `qrCode`,
    DROP COLUMN `totalQty`,
    ADD COLUMN `certifications` JSON NULL,
    ADD COLUMN `createdBy` INTEGER NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `farmName` VARCHAR(191) NOT NULL,
    ADD COLUMN `harvestDate` VARCHAR(191) NULL,
    ADD COLUMN `location` VARCHAR(191) NOT NULL,
    ADD COLUMN `productName` VARCHAR(191) NOT NULL,
    ADD COLUMN `productType` VARCHAR(191) NOT NULL,
    ADD COLUMN `quantity` VARCHAR(191) NULL,
    ADD COLUMN `unit` VARCHAR(191) NULL,
    ADD COLUMN `weight` DOUBLE NOT NULL,
    ADD COLUMN `weightUnit` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `event` DROP COLUMN `details`,
    DROP COLUMN `eventHash`,
    DROP COLUMN `previousEventHash`,
    DROP COLUMN `quantity`,
    DROP COLUMN `type`,
    ADD COLUMN `actor` VARCHAR(191) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `eventType` VARCHAR(191) NOT NULL,
    ADD COLUMN `humidity` VARCHAR(191) NULL,
    ADD COLUMN `location` VARCHAR(191) NOT NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `temperature` VARCHAR(191) NULL,
    ADD COLUMN `timestamp` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'FARMER', 'PROCESSOR', 'DISTRIBUTOR', 'RETAILER', 'USER') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QRCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `batchId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `QRCode_batchId_key`(`batchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Batch` ADD CONSTRAINT `Batch_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QRCode` ADD CONSTRAINT `QRCode_batchId_fkey` FOREIGN KEY (`batchId`) REFERENCES `Batch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

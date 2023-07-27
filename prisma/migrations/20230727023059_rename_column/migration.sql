/*
  Warnings:

  - You are about to drop the column `spotify_album_id` on the `Single` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Single` DROP FOREIGN KEY `Single_spotify_album_id_fkey`;

-- AlterTable
ALTER TABLE `Single` DROP COLUMN `spotify_album_id`,
    ADD COLUMN `albumId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Single` ADD CONSTRAINT `Single_albumId_fkey` FOREIGN KEY (`albumId`) REFERENCES `Album`(`spotify_album_id`) ON DELETE SET NULL ON UPDATE CASCADE;

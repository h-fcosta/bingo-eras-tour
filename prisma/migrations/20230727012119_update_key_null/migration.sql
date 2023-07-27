/*
  Warnings:

  - You are about to drop the column `albumId` on the `Single` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Single` DROP FOREIGN KEY `Single_albumId_fkey`;

-- AlterTable
ALTER TABLE `Single` DROP COLUMN `albumId`,
    ADD COLUMN `spotify_album_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Single` ADD CONSTRAINT `Single_spotify_album_id_fkey` FOREIGN KEY (`spotify_album_id`) REFERENCES `Album`(`spotify_album_id`) ON DELETE SET NULL ON UPDATE CASCADE;

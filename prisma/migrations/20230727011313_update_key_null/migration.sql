-- DropForeignKey
ALTER TABLE `Single` DROP FOREIGN KEY `Single_albumId_fkey`;

-- AlterTable
ALTER TABLE `Single` MODIFY `albumId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Single` ADD CONSTRAINT `Single_albumId_fkey` FOREIGN KEY (`albumId`) REFERENCES `Album`(`spotify_album_id`) ON DELETE SET NULL ON UPDATE CASCADE;

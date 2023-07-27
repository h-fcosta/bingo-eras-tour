/*
  Warnings:

  - You are about to alter the column `release_order` on the `Album` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Album` MODIFY `release_order` INTEGER NULL;

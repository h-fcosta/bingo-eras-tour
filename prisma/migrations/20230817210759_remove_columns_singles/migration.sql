/*
  Warnings:

  - You are about to drop the column `spotify_link` on the `Single` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_single_id` on the `Single` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Single_spotify_single_id_key";

-- AlterTable
ALTER TABLE "Single" DROP COLUMN "spotify_link",
DROP COLUMN "spotify_single_id";

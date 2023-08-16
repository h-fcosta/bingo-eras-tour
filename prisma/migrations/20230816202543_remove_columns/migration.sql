/*
  Warnings:

  - You are about to drop the column `spotify_album_id` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_link` on the `Album` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Album_spotify_album_id_key";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "spotify_album_id",
DROP COLUMN "spotify_link";

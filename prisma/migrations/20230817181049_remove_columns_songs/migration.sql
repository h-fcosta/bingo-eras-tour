/*
  Warnings:

  - You are about to drop the column `spotify_link` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_song_id` on the `Song` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Song_spotify_song_id_key";

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "spotify_link",
DROP COLUMN "spotify_song_id";

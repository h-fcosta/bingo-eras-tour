/*
  Warnings:

  - You are about to drop the column `deezer_album_id` on the `Singles_Links` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_album_id` on the `Singles_Links` table. All the data in the column will be lost.
  - You are about to drop the column `deezer_album_id` on the `Songs_Links` table. All the data in the column will be lost.
  - You are about to drop the column `spotify_album_id` on the `Songs_Links` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[spotify_single_id]` on the table `Singles_Links` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[deezer_single_id]` on the table `Singles_Links` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spotify_song_id]` on the table `Songs_Links` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[deezer_song_id]` on the table `Songs_Links` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Singles_Links_deezer_album_id_key";

-- DropIndex
DROP INDEX "Singles_Links_spotify_album_id_key";

-- DropIndex
DROP INDEX "Songs_Links_deezer_album_id_key";

-- DropIndex
DROP INDEX "Songs_Links_spotify_album_id_key";

-- AlterTable
ALTER TABLE "Singles_Links" DROP COLUMN "deezer_album_id",
DROP COLUMN "spotify_album_id",
ADD COLUMN     "deezer_single_id" TEXT,
ADD COLUMN     "spotify_single_id" TEXT;

-- AlterTable
ALTER TABLE "Songs_Links" DROP COLUMN "deezer_album_id",
DROP COLUMN "spotify_album_id",
ADD COLUMN     "deezer_song_id" TEXT,
ADD COLUMN     "spotify_song_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Singles_Links_spotify_single_id_key" ON "Singles_Links"("spotify_single_id");

-- CreateIndex
CREATE UNIQUE INDEX "Singles_Links_deezer_single_id_key" ON "Singles_Links"("deezer_single_id");

-- CreateIndex
CREATE UNIQUE INDEX "Songs_Links_spotify_song_id_key" ON "Songs_Links"("spotify_song_id");

-- CreateIndex
CREATE UNIQUE INDEX "Songs_Links_deezer_song_id_key" ON "Songs_Links"("deezer_song_id");

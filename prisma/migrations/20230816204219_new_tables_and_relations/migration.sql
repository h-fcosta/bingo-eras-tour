-- DropForeignKey
ALTER TABLE "Fact" DROP CONSTRAINT "Fact_songId_fkey";

-- AlterTable
ALTER TABLE "Fact" ADD COLUMN     "singleId" TEXT,
ALTER COLUMN "songId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Songs_Links" (
    "id" TEXT NOT NULL,
    "spotify_album_id" TEXT,
    "spotify_link" TEXT,
    "deezer_album_id" TEXT,
    "deezer_link" TEXT,
    "songId" TEXT,

    CONSTRAINT "Songs_Links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Singles_Links" (
    "id" TEXT NOT NULL,
    "spotify_album_id" TEXT,
    "spotify_link" TEXT,
    "deezer_album_id" TEXT,
    "deezer_link" TEXT,
    "singleId" TEXT,

    CONSTRAINT "Singles_Links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Songs_Links_spotify_album_id_key" ON "Songs_Links"("spotify_album_id");

-- CreateIndex
CREATE UNIQUE INDEX "Songs_Links_deezer_album_id_key" ON "Songs_Links"("deezer_album_id");

-- CreateIndex
CREATE UNIQUE INDEX "Singles_Links_spotify_album_id_key" ON "Singles_Links"("spotify_album_id");

-- CreateIndex
CREATE UNIQUE INDEX "Singles_Links_deezer_album_id_key" ON "Singles_Links"("deezer_album_id");

-- AddForeignKey
ALTER TABLE "Songs_Links" ADD CONSTRAINT "Songs_Links_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Singles_Links" ADD CONSTRAINT "Singles_Links_singleId_fkey" FOREIGN KEY ("singleId") REFERENCES "Single"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fact" ADD CONSTRAINT "Fact_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fact" ADD CONSTRAINT "Fact_singleId_fkey" FOREIGN KEY ("singleId") REFERENCES "Single"("id") ON DELETE SET NULL ON UPDATE CASCADE;

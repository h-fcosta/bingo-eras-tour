-- CreateTable
CREATE TABLE "Links" (
    "id" TEXT NOT NULL,
    "spotify_id" TEXT,
    "spotify_link" TEXT,
    "deezer_id" TEXT,
    "deezer_link" TEXT,
    "albumId" TEXT,
    "songId" TEXT,
    "singleId" TEXT,

    CONSTRAINT "Links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Links_spotify_id_key" ON "Links"("spotify_id");

-- CreateIndex
CREATE UNIQUE INDEX "Links_deezer_id_key" ON "Links"("deezer_id");

-- CreateIndex
CREATE UNIQUE INDEX "Links_albumId_key" ON "Links"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "Links_songId_key" ON "Links"("songId");

-- CreateIndex
CREATE UNIQUE INDEX "Links_singleId_key" ON "Links"("singleId");

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Links" ADD CONSTRAINT "Links_singleId_fkey" FOREIGN KEY ("singleId") REFERENCES "Single"("id") ON DELETE SET NULL ON UPDATE CASCADE;

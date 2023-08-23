-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "song_name" TEXT NOT NULL,
    "played" BOOLEAN NOT NULL DEFAULT false,
    "played_at" TEXT,
    "played_when" TIMESTAMP(3),
    "on_set_list" BOOLEAN NOT NULL DEFAULT false,
    "albumId" TEXT NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Songs_Links" (
    "id" TEXT NOT NULL,
    "spotify_song_id" TEXT,
    "spotify_link" TEXT,
    "deezer_song_id" TEXT,
    "deezer_link" TEXT,
    "songId" TEXT NOT NULL,

    CONSTRAINT "Songs_Links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Single" (
    "id" TEXT NOT NULL,
    "single_name" TEXT NOT NULL,
    "played" BOOLEAN NOT NULL DEFAULT false,
    "played_at" TEXT,
    "played_when" TIMESTAMP(3),
    "on_set_list" BOOLEAN NOT NULL DEFAULT false,
    "albumId" TEXT,

    CONSTRAINT "Single_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Singles_Links" (
    "id" TEXT NOT NULL,
    "spotify_single_id" TEXT,
    "spotify_link" TEXT,
    "deezer_single_id" TEXT,
    "deezer_link" TEXT,
    "singleId" TEXT,

    CONSTRAINT "Singles_Links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fact" (
    "id" TEXT NOT NULL,
    "fact" TEXT NOT NULL,
    "songId" TEXT,
    "singleId" TEXT,

    CONSTRAINT "Fact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Songs_Links_spotify_song_id_key" ON "Songs_Links"("spotify_song_id");

-- CreateIndex
CREATE UNIQUE INDEX "Songs_Links_deezer_song_id_key" ON "Songs_Links"("deezer_song_id");

-- CreateIndex
CREATE UNIQUE INDEX "Songs_Links_songId_key" ON "Songs_Links"("songId");

-- CreateIndex
CREATE UNIQUE INDEX "Singles_Links_spotify_single_id_key" ON "Singles_Links"("spotify_single_id");

-- CreateIndex
CREATE UNIQUE INDEX "Singles_Links_deezer_single_id_key" ON "Singles_Links"("deezer_single_id");

-- CreateIndex
CREATE UNIQUE INDEX "Singles_Links_singleId_key" ON "Singles_Links"("singleId");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Songs_Links" ADD CONSTRAINT "Songs_Links_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Single" ADD CONSTRAINT "Single_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Singles_Links" ADD CONSTRAINT "Singles_Links_singleId_fkey" FOREIGN KEY ("singleId") REFERENCES "Single"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fact" ADD CONSTRAINT "Fact_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fact" ADD CONSTRAINT "Fact_singleId_fkey" FOREIGN KEY ("singleId") REFERENCES "Single"("id") ON DELETE SET NULL ON UPDATE CASCADE;

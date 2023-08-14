-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL,
    "spotify_album_id" TEXT NOT NULL,
    "album_name" TEXT NOT NULL,
    "release_date" TEXT NOT NULL,
    "spotify_link" TEXT NOT NULL,
    "release_order" TEXT,
    "album_color" TEXT,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "spotify_song_id" TEXT NOT NULL,
    "song_name" TEXT NOT NULL,
    "spotify_link" TEXT NOT NULL,
    "played" BOOLEAN NOT NULL DEFAULT false,
    "played_at" TEXT,
    "played_when" TIMESTAMP(3),
    "on_set_list" BOOLEAN NOT NULL DEFAULT false,
    "albumId" TEXT NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fact" (
    "id" TEXT NOT NULL,
    "fact" TEXT NOT NULL,
    "songId" TEXT NOT NULL,

    CONSTRAINT "Fact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Single" (
    "id" TEXT NOT NULL,
    "spotify_single_id" TEXT NOT NULL,
    "single_name" TEXT NOT NULL,
    "spotify_link" TEXT NOT NULL,
    "played" BOOLEAN NOT NULL DEFAULT false,
    "played_at" TEXT,
    "played_when" TIMESTAMP(3),
    "on_set_list" BOOLEAN NOT NULL DEFAULT false,
    "albumId" TEXT,

    CONSTRAINT "Single_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Album_spotify_album_id_key" ON "Album"("spotify_album_id");

-- CreateIndex
CREATE UNIQUE INDEX "Song_spotify_song_id_key" ON "Song"("spotify_song_id");

-- CreateIndex
CREATE UNIQUE INDEX "Single_spotify_single_id_key" ON "Single"("spotify_single_id");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("spotify_album_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fact" ADD CONSTRAINT "Fact_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Single" ADD CONSTRAINT "Single_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("spotify_album_id") ON DELETE SET NULL ON UPDATE CASCADE;

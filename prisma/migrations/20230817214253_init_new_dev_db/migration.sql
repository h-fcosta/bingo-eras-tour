-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL,
    "album_name" TEXT NOT NULL,
    "release_date" TEXT NOT NULL,
    "release_order" TEXT,
    "album_color" TEXT,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Albuns_Links" (
    "id" TEXT NOT NULL,
    "spotify_album_id" TEXT,
    "spotify_link" TEXT,
    "deezer_album_id" TEXT,
    "deezer_link" TEXT,
    "albumId" TEXT NOT NULL,

    CONSTRAINT "Albuns_Links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Albuns_Links_albumId_key" ON "Albuns_Links"("albumId");

-- AddForeignKey
ALTER TABLE "Albuns_Links" ADD CONSTRAINT "Albuns_Links_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

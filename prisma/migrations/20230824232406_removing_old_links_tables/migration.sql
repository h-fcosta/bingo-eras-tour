/*
  Warnings:

  - You are about to drop the `Albuns_Links` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Singles_Links` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Songs_Links` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Albuns_Links" DROP CONSTRAINT "Albuns_Links_albumId_fkey";

-- DropForeignKey
ALTER TABLE "Singles_Links" DROP CONSTRAINT "Singles_Links_singleId_fkey";

-- DropForeignKey
ALTER TABLE "Songs_Links" DROP CONSTRAINT "Songs_Links_songId_fkey";

-- DropTable
DROP TABLE "Albuns_Links";

-- DropTable
DROP TABLE "Singles_Links";

-- DropTable
DROP TABLE "Songs_Links";

-- CreateTable
CREATE TABLE `Album` (
    `id` VARCHAR(191) NOT NULL,
    `spotify_album_id` VARCHAR(191) NOT NULL,
    `album_name` VARCHAR(191) NOT NULL,
    `release_date` DATETIME(3) NOT NULL,
    `spotify_link` VARCHAR(191) NOT NULL,
    `release_order` INTEGER NULL,
    `album_color` VARCHAR(191) NULL,

    UNIQUE INDEX `Album_spotify_album_id_key`(`spotify_album_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Song` (
    `id` VARCHAR(191) NOT NULL,
    `spotify_song_id` VARCHAR(191) NOT NULL,
    `song_name` VARCHAR(191) NOT NULL,
    `spotify_link` VARCHAR(191) NOT NULL,
    `played` BOOLEAN NOT NULL DEFAULT false,
    `played_at` VARCHAR(191) NULL,
    `played_when` DATETIME(3) NULL,
    `on_set_list` BOOLEAN NOT NULL DEFAULT false,
    `albumId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Song_spotify_song_id_key`(`spotify_song_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fact` (
    `id` VARCHAR(191) NOT NULL,
    `fact` VARCHAR(191) NOT NULL,
    `songId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Single` (
    `id` VARCHAR(191) NOT NULL,
    `spotify_single_id` VARCHAR(191) NOT NULL,
    `single_name` VARCHAR(191) NOT NULL,
    `spotify_link` VARCHAR(191) NOT NULL,
    `played` BOOLEAN NOT NULL DEFAULT false,
    `played_at` VARCHAR(191) NULL,
    `played_when` DATETIME(3) NULL,
    `on_set_list` BOOLEAN NOT NULL DEFAULT false,
    `albumId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Single_spotify_single_id_key`(`spotify_single_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Song` ADD CONSTRAINT `Song_albumId_fkey` FOREIGN KEY (`albumId`) REFERENCES `Album`(`spotify_album_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fact` ADD CONSTRAINT `Fact_songId_fkey` FOREIGN KEY (`songId`) REFERENCES `Song`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Single` ADD CONSTRAINT `Single_albumId_fkey` FOREIGN KEY (`albumId`) REFERENCES `Album`(`spotify_album_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

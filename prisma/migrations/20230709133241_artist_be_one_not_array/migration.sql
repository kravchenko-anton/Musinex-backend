/*
  Warnings:

  - You are about to drop the column `favorite_user_id` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the `_AlbumToArtist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ArtistToSong` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `artistId` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `artistId` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_favorite_user_id_fkey";

-- DropForeignKey
ALTER TABLE "_AlbumToArtist" DROP CONSTRAINT "_AlbumToArtist_A_fkey";

-- DropForeignKey
ALTER TABLE "_AlbumToArtist" DROP CONSTRAINT "_AlbumToArtist_B_fkey";

-- DropForeignKey
ALTER TABLE "_ArtistToSong" DROP CONSTRAINT "_ArtistToSong_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArtistToSong" DROP CONSTRAINT "_ArtistToSong_B_fkey";

-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "artistId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "favorite_user_id";

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "artistId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_AlbumToArtist";

-- DropTable
DROP TABLE "_ArtistToSong";

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

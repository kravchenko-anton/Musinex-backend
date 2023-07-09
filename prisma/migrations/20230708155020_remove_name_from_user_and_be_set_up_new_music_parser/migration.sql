/*
  Warnings:

  - You are about to drop the column `userId` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `avatar_path` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `color` to the `Genre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Genre` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_userId_fkey";

-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "user_id" INTEGER;

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "user_id" INTEGER;

-- AlterTable
ALTER TABLE "Genre" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "icon" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "userId",
ADD COLUMN     "favorite_user_id" INTEGER,
ADD COLUMN     "user_id" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar_path",
DROP COLUMN "name";

-- CreateTable
CREATE TABLE "_SongToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_GenreToPlaylist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SongToUser_AB_unique" ON "_SongToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SongToUser_B_index" ON "_SongToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GenreToPlaylist_AB_unique" ON "_GenreToPlaylist"("A", "B");

-- CreateIndex
CREATE INDEX "_GenreToPlaylist_B_index" ON "_GenreToPlaylist"("B");

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_favorite_user_id_fkey" FOREIGN KEY ("favorite_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SongToUser" ADD CONSTRAINT "_SongToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SongToUser" ADD CONSTRAINT "_SongToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToPlaylist" ADD CONSTRAINT "_GenreToPlaylist_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToPlaylist" ADD CONSTRAINT "_GenreToPlaylist_B_fkey" FOREIGN KEY ("B") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

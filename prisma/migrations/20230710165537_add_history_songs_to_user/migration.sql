/*
  Warnings:

  - You are about to drop the `_SongToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SongToUser" DROP CONSTRAINT "_SongToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SongToUser" DROP CONSTRAINT "_SongToUser_B_fkey";

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "userId" INTEGER;

-- DropTable
DROP TABLE "_SongToUser";

-- CreateTable
CREATE TABLE "_FavoriteSongs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FavoriteSongs_AB_unique" ON "_FavoriteSongs"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoriteSongs_B_index" ON "_FavoriteSongs"("B");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteSongs" ADD CONSTRAINT "_FavoriteSongs_A_fkey" FOREIGN KEY ("A") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteSongs" ADD CONSTRAINT "_FavoriteSongs_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

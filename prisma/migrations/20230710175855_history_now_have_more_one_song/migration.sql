/*
  Warnings:

  - You are about to drop the column `songId` on the `History` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_songId_fkey";

-- AlterTable
ALTER TABLE "History" DROP COLUMN "songId";

-- CreateTable
CREATE TABLE "_HistoryToSong" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HistoryToSong_AB_unique" ON "_HistoryToSong"("A", "B");

-- CreateIndex
CREATE INDEX "_HistoryToSong_B_index" ON "_HistoryToSong"("B");

-- AddForeignKey
ALTER TABLE "_HistoryToSong" ADD CONSTRAINT "_HistoryToSong_A_fkey" FOREIGN KEY ("A") REFERENCES "History"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HistoryToSong" ADD CONSTRAINT "_HistoryToSong_B_fkey" FOREIGN KEY ("B") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `userId` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `RelatedSongId` on the `Song` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_userId_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_RelatedSongId_fkey";

-- AlterTable
ALTER TABLE "History" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER;

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "RelatedSongId",
ADD COLUMN     "relatedSongId" INTEGER;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_relatedSongId_fkey" FOREIGN KEY ("relatedSongId") REFERENCES "Song"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

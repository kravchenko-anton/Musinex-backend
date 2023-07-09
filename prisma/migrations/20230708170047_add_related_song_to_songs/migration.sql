-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "RelatedSongId" INTEGER;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_RelatedSongId_fkey" FOREIGN KEY ("RelatedSongId") REFERENCES "Song"("id") ON DELETE SET NULL ON UPDATE CASCADE;

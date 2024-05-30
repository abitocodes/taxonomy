/*
  Warnings:

  - Added the required column `genreId` to the `post_votes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post_votes" ADD COLUMN     "genreId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

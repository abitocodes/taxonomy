/*
  Warnings:

  - Added the required column `communityId` to the `post_votes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post_votes" ADD COLUMN     "communityId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

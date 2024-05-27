/*
  Warnings:

  - Made the column `creatorId` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `voteStatus` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_creatorId_fkey";

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "creatorId" SET NOT NULL,
ALTER COLUMN "voteStatus" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

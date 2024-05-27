/*
  Warnings:

  - You are about to drop the column `creatorDisplayText` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `creatorDisplayText` on the `posts` table. All the data in the column will be lost.
  - Added the required column `authorDisplayText` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "creatorDisplayText",
ADD COLUMN     "authorDisplayText" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "creatorDisplayText",
ADD COLUMN     "authorDisplayText" TEXT;

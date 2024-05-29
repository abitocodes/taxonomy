/*
  Warnings:

  - You are about to drop the column `authorDisplayText` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `authorDisplayText` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "authorDisplayText";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "authorDisplayText";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "authorDisplayText" TEXT;

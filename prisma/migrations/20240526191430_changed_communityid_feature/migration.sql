/*
  Warnings:

  - Made the column `genreId` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "genreId" SET NOT NULL;

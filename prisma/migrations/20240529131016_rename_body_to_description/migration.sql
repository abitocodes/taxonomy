/*
  Warnings:

  - You are about to drop the column `body` on the `posts` table. All the data in the column will be lost.
  - Added the required column `description` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts"
ADD COLUMN "description" TEXT NOT NULL DEFAULT 'newly created by code';

UPDATE "posts"
SET "description" = "body";

ALTER TABLE "posts"
DROP COLUMN "body";
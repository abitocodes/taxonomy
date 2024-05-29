/*
  Warnings:

  - You are about to drop the column `authorDisplayText` on the `users` table. All the data in the column will be lost.
  - Made the column `body` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "body" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "authorDisplayText",
ADD COLUMN     "handler" TEXT,
ADD COLUMN     "nickName" TEXT;

-- CreateTable
CREATE TABLE "labels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LabelToPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "labels_name_key" ON "labels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_LabelToPost_AB_unique" ON "_LabelToPost"("A", "B");

-- CreateIndex
CREATE INDEX "_LabelToPost_B_index" ON "_LabelToPost"("B");

-- AddForeignKey
ALTER TABLE "_LabelToPost" ADD CONSTRAINT "_LabelToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "labels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LabelToPost" ADD CONSTRAINT "_LabelToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

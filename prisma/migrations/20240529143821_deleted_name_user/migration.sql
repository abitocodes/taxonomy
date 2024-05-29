/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[handler]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `handler` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nickName` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ALTER COLUMN "handler" SET NOT NULL,
ALTER COLUMN "nickName" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_handler_key" ON "users"("handler");

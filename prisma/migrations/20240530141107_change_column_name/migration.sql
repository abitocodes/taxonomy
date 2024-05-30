/*
  Warnings:

  - You are about to drop the column `stripe_current_period_end` on the `public_users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_customer_id` on the `public_users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_price_id` on the `public_users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_id` on the `public_users` table. All the data in the column will be lost.
  - You are about to drop the `PostVote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_tokens` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `public_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `public_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creatorId` to the `labels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `labels` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PostVote" DROP CONSTRAINT "PostVote_genreId_fkey";

-- DropForeignKey
ALTER TABLE "PostVote" DROP CONSTRAINT "PostVote_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostVote" DROP CONSTRAINT "PostVote_userId_fkey";

-- DropIndex
DROP INDEX "public_users_stripe_customer_id_key";

-- DropIndex
DROP INDEX "public_users_stripe_subscription_id_key";

-- AlterTable
ALTER TABLE "labels" ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "postId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public_users" DROP COLUMN "stripe_current_period_end",
DROP COLUMN "stripe_customer_id",
DROP COLUMN "stripe_price_id",
DROP COLUMN "stripe_subscription_id",
ADD COLUMN     "stripeCurrentPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripePriceId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT;

-- DropTable
DROP TABLE "PostVote";

-- DropTable
DROP TABLE "verification_tokens";

-- CreateTable
CREATE TABLE "post_votes" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "voteValue" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "post_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "public_users_stripeCustomerId_key" ON "public_users"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "public_users_stripeSubscriptionId_key" ON "public_users"("stripeSubscriptionId");

-- AddForeignKey
ALTER TABLE "labels" ADD CONSTRAINT "labels_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "genres_snippets" DROP CONSTRAINT "genres_snippets_userId_fkey";

-- DropForeignKey
ALTER TABLE "post_votes" DROP CONSTRAINT "post_votes_userId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_creatorId_fkey";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "public_users" (
    "id" TEXT NOT NULL,
    "nickName" TEXT NOT NULL,
    "handler" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_price_id" TEXT,
    "stripe_current_period_end" TIMESTAMP(3),

    CONSTRAINT "public_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "public_users_handler_key" ON "public_users"("handler");

-- CreateIndex
CREATE UNIQUE INDEX "public_users_email_key" ON "public_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "public_users_stripe_customer_id_key" ON "public_users"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "public_users_stripe_subscription_id_key" ON "public_users"("stripe_subscription_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genres_snippets" ADD CONSTRAINT "genres_snippets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

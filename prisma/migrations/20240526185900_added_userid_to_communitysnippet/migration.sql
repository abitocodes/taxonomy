/*
  Warnings:

  - You are about to drop the `CommunitySnippet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommunitySnippet" DROP CONSTRAINT "CommunitySnippet_communityId_fkey";

-- DropTable
DROP TABLE "CommunitySnippet";

-- CreateTable
CREATE TABLE "communities_snippets" (
    "id" SERIAL NOT NULL,
    "communityId" TEXT NOT NULL,
    "userId" TEXT,
    "isModerator" BOOLEAN DEFAULT false,
    "imageURL" TEXT,

    CONSTRAINT "communities_snippets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "communities_snippets" ADD CONSTRAINT "communities_snippets_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communities_snippets" ADD CONSTRAINT "communities_snippets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

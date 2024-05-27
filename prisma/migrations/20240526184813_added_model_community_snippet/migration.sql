-- CreateTable
CREATE TABLE "CommunitySnippet" (
    "id" SERIAL NOT NULL,
    "communityId" TEXT NOT NULL,
    "isModerator" BOOLEAN DEFAULT false,
    "imageURL" TEXT,

    CONSTRAINT "CommunitySnippet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommunitySnippet" ADD CONSTRAINT "CommunitySnippet_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

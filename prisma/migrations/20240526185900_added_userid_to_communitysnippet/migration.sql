/*
  Warnings:

  - You are about to drop the `GenreSnippet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GenreSnippet" DROP CONSTRAINT "GenreSnippet_genreId_fkey";

-- DropTable
DROP TABLE "GenreSnippet";

-- CreateTable
CREATE TABLE "genres_snippets" (
    "id" SERIAL NOT NULL,
    "genreId" TEXT NOT NULL,
    "userId" TEXT,
    "isModerator" BOOLEAN DEFAULT false,
    "imageURL" TEXT,

    CONSTRAINT "genres_snippets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "genres_snippets" ADD CONSTRAINT "genres_snippets_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genres_snippets" ADD CONSTRAINT "genres_snippets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

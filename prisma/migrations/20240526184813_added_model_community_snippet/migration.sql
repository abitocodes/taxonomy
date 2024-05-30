-- CreateTable
CREATE TABLE "GenreSnippet" (
    "id" SERIAL NOT NULL,
    "genreId" TEXT NOT NULL,
    "isModerator" BOOLEAN DEFAULT false,
    "imageURL" TEXT,

    CONSTRAINT "GenreSnippet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GenreSnippet" ADD CONSTRAINT "GenreSnippet_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

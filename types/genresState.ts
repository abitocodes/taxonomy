type Timestamp = Date;

export type Genre = {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: "public" | "restricted" | "private";
  createdAt?: Timestamp;
  imageURL?: string;
};

export type GenreSnippet = {
  genreId: string;
  isModerator?: boolean;
  imageURL?: string;
};

export type GenreState = {
  [key: string]: GenreSnippet[] | { [key: string]: Genre } | Genre | boolean | undefined;
  mySnippets: GenreSnippet[];
  initSnippetsFetched: boolean;
  visitedGenres: {
    [key: string]: Genre;
  };
  currentGenre: Genre;
};

import { atom } from "recoil";

import { Genre, GenreState } from "@/types/GenreState";

export const defaultGenre: Genre = {
  id: "",
  creatorId: "",
  numberOfMembers: 0,
  privacyType: "public",
};

export const defaultGenreState: GenreState = {
  mySnippets: [],
  initSnippetsFetched: false,
  visitedCommunities: {},
  currentGenre: defaultGenre,
};

export const genreState = atom<GenreState>({
  key: "genresState",
  default: defaultGenreState,
});

import { atom } from "recoil";

import { GenreModalState } from "@/types/genresModalState";

const defaultModalState: GenreModalState = {
  open: false,
};

export const genreModalState = atom<GenreModalState>({
  key: "genreModalState",
  default: defaultModalState,
});

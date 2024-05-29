import { atom } from "recoil";

import { PostsState } from "../types/PostsState";

export const defaultPostsState: PostsState = {
  selectedPost: null,
  posts: [],
  postVotes: [],
  postsCache: {},
  postUpdateRequired: true,
};

export const postState = atom<PostsState>({
  key: "postState",
  default: defaultPostsState,
});

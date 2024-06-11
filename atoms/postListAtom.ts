import { atom } from "recoil";

import { PostListState } from "@/types/post/PostList";

export const defaultPostListState: PostListState = {
  selectedPost: null,
  postList: [],
  postVotes: [],
  postListCache: {},
  postUpdateRequired: true,
};

export const postListState = atom<PostListState>({
  key: "postListState",
  default: defaultPostListState,
});

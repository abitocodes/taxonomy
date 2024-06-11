import { atom } from "recoil";

import { CommentListState } from "@/types/comment/CommentList";

export const defaultCommentListState: CommentListState = {
  selectedComment: null,
  commentList: [],
  commentVotes: [],
  commentListCache: {},
  commentUpdateRequired: true,
};

export const commentListState = atom<CommentListState>({
  key: "commentListState",
  default: defaultCommentListState,
});

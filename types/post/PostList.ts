import { PostVote } from "@prisma/client";
import { PostWith } from "@/types/post";
import { CommentWith } from "@/types/comment/CommentList";
import { CommentVote } from "@prisma/client";

export type PostListState = {
  selectedPost: PostWith | null;

  postList: PostWith[];
  postVotes: PostVote[];
  postListCache: {
    [key: string]: PostWith[];
  };
  postListUpdateRequired: boolean;

  selectedPostCommentList: CommentWith[];
  selectedPostCommentVotes: CommentVote[];
  selectedPostCommentListCache: {
    [key: string]: CommentWith[];
  };
  selectedPostCommentListUpdateRequired: boolean;
};



import { CommentVote } from "@prisma/client";
import { Comment } from "@prisma/client";

export type CommentWith = Comment & {
  publicUsers: {
    nickName: string;
  };
};

export type CommentListState = {
  selectedComment: CommentWith | null;
  commentList: CommentWith[];
  commentVotes: CommentVote[];
  commentListCache: {
    [key: string]: Comment[];
  };
  commentUpdateRequired: boolean;
};



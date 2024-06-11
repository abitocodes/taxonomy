import { CommentVote } from "@prisma/client";
import { Comment } from "@prisma/client";


export type CommentListState = {
  selectedComment: Comment | null;
  commentList: Comment[];
  commentVotes: CommentVote[];
  commentListCache: {
    [key: string]: Comment[];
  };
  commentUpdateRequired: boolean;
};



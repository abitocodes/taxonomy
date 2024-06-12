import { PostVote } from "@prisma/client";
import { PostWith } from "@/types/post";
import { CommentWith } from "@/components/CommentSection/CommentItem";
import { CommentVote } from "@prisma/client";

export type PostListState = {
  selectedPost: PostWith | null;

  postList: PostWith[];
  postVotes: PostVote[];
  postListCache: {
    [key: string]: PostWith[];
  };
  postListUpdateRequired: boolean;

  isAlreadyVotedList: boolean[];
  isUserCreatorList: boolean[];

  selectedPostCommentList: CommentWith[];
  selectedPostCommentVotes: CommentVote[];
  selectedPostCommentListCache: {
    [key: string]: CommentWith[];
  };
  selectedPostCommentListUpdateRequired: boolean;
};



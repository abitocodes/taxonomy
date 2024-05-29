import type { Post, Label, User } from "@prisma/client";
import { PostVote } from "@prisma/client";

export type PostWith = Post & {
  labels: Label[];
  creator: User;
};

export type PostsState = {
  selectedPost: PostWith | null;
  posts: PostWith[];
  postVotes: PostVote[];
  postsCache: {
    [key: string]: PostWith[];
  };
  postUpdateRequired: boolean;
};



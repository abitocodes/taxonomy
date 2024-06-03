import type { Post, Label, PublicUser } from "@prisma/client";
import { PostVote } from "@prisma/client";

export type PostWith = Post & {
  channel: {
    name: string;
  };
  labels: Label[];
  creator: PublicUser;
  publicUsers: PublicUser;
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



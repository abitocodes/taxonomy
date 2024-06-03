import type { posts, labels, PublicUser } from "@prisma/client";
import { PostVote } from "@prisma/client";

export type postsWith = posts & {
  labels: labels[];
  creator: PublicUser;
};

export type postssState = {
  selectedposts: postsWith | null;
  posts: postsWith[];
  postVotes: PostVote[];
  postsCache: {
    [key: string]: postsWith[];
  };
  postUpdateRequired: boolean;
};



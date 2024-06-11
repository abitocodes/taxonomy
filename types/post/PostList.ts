import { PostVote } from "@prisma/client";
import { PostWith } from "@/types/post";


export type PostListState = {
  selectedPost: PostWith | null;
  postList: PostWith[];
  postVotes: PostVote[];
  postListCache: {
    [key: string]: PostWith[];
  };
  postUpdateRequired: boolean;
};



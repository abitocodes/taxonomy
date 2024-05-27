type Timestamp = Date;

export type Post = {
  id: string;
  title: string;
  body?: string;
  link?: string;
  numberOfComments: number;
  voteStatus: number;
  createdAt: Timestamp;
  editedAt: Timestamp;
  communityId: string;
  communityImageURL?: string;
  authorDisplayText: string;
  creatorId: string;
  currentUserVoteStatus?: {
    id: string;
    voteValue: number;
  };
  mediaType?: "image" | "video";
  mediaURL?: string;
  postIdx?: number;

};

export type PostVote = {
  id: string;
  postId: string;
  voteValue: number;
  communityId?: string; // 선택적 속성으로 변경
};

export type PostState = {
  selectedPost: Post | null;
  posts: Post[];
  postVotes: PostVote[];
  postsCache: {
    [key: string]: Post[];
  };
  postUpdateRequired: boolean;
};

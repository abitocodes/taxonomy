type Timestamp = Date;

export type Community = {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: "public" | "restricted" | "private";
  createdAt?: Timestamp;
  imageURL?: string;
};

export type CommunitySnippet = {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
};

export type CommunityState = {
  [key: string]: CommunitySnippet[] | { [key: string]: Community } | Community | boolean | undefined;
  mySnippets: CommunitySnippet[];
  initSnippetsFetched: boolean;
  visitedCommunities: {
    [key: string]: Community;
  };
  currentCommunity: Community;
};

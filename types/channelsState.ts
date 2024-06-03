type Timestamp = Date;

export type Channel = {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: "public" | "restricted" | "private";
  createdAt?: Timestamp;
  imageURL?: string;
};

export type ChannelSnippet = {
  channelId: string;
  isModerator?: boolean;
  imageURL?: string;
};

export type ChannelState = {
  [key: string]: ChannelSnippet[] | { [key: string]: Channel } | Channel | boolean | undefined;
  mySnippets: ChannelSnippet[];
  initSnippetsFetched: boolean;
  visitedChannels: {
    [key: string]: Channel;
  };
  currentChannel: Channel;
};

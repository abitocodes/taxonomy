type Timestamp = Date;

export type Comment = {
  id?: string;
  creatorId: string;
  creatorDisplayText: string;
  creatorPhotoURL: string;
  channelId: string;
  postId: string;
  text: string;
  createdAt?: Timestamp;
};

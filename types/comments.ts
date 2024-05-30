type Timestamp = Date;

export type Comment = {
  id?: string;
  creatorId: string;
  creatorDisplayText: string;
  creatorPhotoURL: string;
  genreId: string;
  postId: string;
  postTitle: string;
  text: string;
  createdAt?: Timestamp;
};

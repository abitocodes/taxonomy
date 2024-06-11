import type { Post, Label, PublicUser } from "@prisma/client";

export type PostWith = Post & {
    channel: {
      name: string;
    };
    labels: Label[];
    creator: PublicUser;
    publicUsers: PublicUser;
  };
"use client"

import { FC } from "react";
import { PostWith } from "@/types/post";

type SimplePostItemProps = {
  key: number;
  post: PostWith;
  postIdx: number;
};

const SimplePostItem: FC<SimplePostItemProps> = ({ post, postIdx }) => {
  return (
    <div className="flex flex-col p-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold">{post.title}</h3>
      <p className="text-sm text-gray-600">{post.description}</p>
      <span className="text-xs text-gray-500">Index: {postIdx}</span>
    </div>
  );
};

export default SimplePostItem;
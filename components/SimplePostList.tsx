"use client"

import React from 'react';
import { PostWith } from "@/types/posts";
import SimplePostItem from "@/features/Post/SimplePostItem";

interface SimplePostListProps {
  post: PostWith[];
}

const SimplePostList: React.FC<SimplePostListProps> = ({ posts }) => {
  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <SimplePostItem
          key={index}
          post={post}
          postIdx={index}
        />
      ))}
    </div>
  );
};

export default SimplePostList;
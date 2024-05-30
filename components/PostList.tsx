import React from 'react';
import { postsWith } from "@/types/posts";
import { PostVote } from "@prisma/client";
import PostItem from "@/features/Post/PostItem";

interface PostListProps {
    posts: postsWith[];
    postVotes: PostVote[];
    onVote: (postId: string, voteValue: number) => Promise<void>;
    onDeletePost: (postId: string) => Promise<void>;
    onSelectPost: (post: postsWith) => void;
    userId: string | undefined;
  }

export const PostList: React.FC<PostListProps> = ({ posts, postVotes, onVote, onDeletePost, onSelectPost, userId }) => {
    return (
      <div className="space-y-6">
        {posts.map((post, index) => (
          <PostItem
            key={index}
            post={post}
            postIdx={index}
            onVote={() => onVote(post.id, 1).then(() => true).catch(() => false)}
            onDeletePost={() => onDeletePost(post.id).then(() => true).catch(() => false)}
            userVoteValue={postVotes.find((item) => item.postId === post.id)?.voteValue}
            userIsCreator={userId === post.creatorId}
            onSelectPost={() => onSelectPost(post)}
            homePage
          />
        ))}
      </div>
    );
  };
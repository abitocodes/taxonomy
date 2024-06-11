import React from 'react';
import { PostWith } from "@/types/post";
import { PostVote } from "@prisma/client";
import PostItem from "@/features/Post/PostItem";

interface PostListProps {
    postList: PostWith[];
    postVotes: PostVote[];
    onVote: (postId: string, voteValue: number) => Promise<void>;
    onDeletePost: (postId: string) => Promise<void>;
    onSelectPost: (post: PostWith) => void;
    userId: string | undefined;
  }

export const PostList: React.FC<PostListProps> = ({ postList, postVotes, onVote, onDeletePost, onSelectPost, userId }) => {
    return (
      <div className="space-y-6">
        {postList.map((post, index) => (
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
import React from 'react';
import { PostWith } from "@/types/post";
import { PostVote } from "@prisma/client";
import { PostItem } from '@/components/Post/PostItem';
import { Session } from '@supabase/supabase-js';
import { Post } from '@prisma/client';

interface PostListProps {
  postList: PostWith[];
  postVotes: PostVote[];
  globalSessionData: Session | null;
  onSelectPost?: (value: Post, postIdx: number) => void;
  onVotePost: (event: React.MouseEvent<Element, MouseEvent>, post: Post, globalSessionData: Session | null) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
}

export const PostList: React.FC<PostListProps> = ({ 
  postList, 
  postVotes, 
  globalSessionData, 
  onSelectPost, 
  onVotePost, 
  onDeletePost }) => {
    return (
      <div className="space-y-6">
        {postList.map((post, index) => (
          <PostItem
            key={post.id}
            post={post}
            postIdx={index}
            globalSessionData={globalSessionData || null}
            onSelectPost={onSelectPost}
            onVotePost={onVotePost}
            onDeletePost={onDeletePost}
            isAlreadyVoted={!!postVotes.find((v) => v.postId === post.id)}
            isUserCreator={globalSessionData?.user?.id === post.creatorId}
            homePage
          />
        ))}
      </div>
    );
  };
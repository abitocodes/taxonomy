"use client"

import { FC, useEffect } from "react";
import { useAuthState } from "@/hooks/useAuthState";

import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

import PageContentLayout from "@/components/reddit/Layout/PageContent";
import PostLoader from "@/components/reddit/Loader/PostLoader";
import About from "@/features/Community/About";
import Comments from "@/features/Post/Comments";
import PostItem from "@/features/Post/PostItem";
import useCommunityData from "@/hooks/useCommunityData";
import usePosts from "@/hooks/usePosts";
import { Post } from "@prisma/client";
import { useState } from "react";
import { Session } from '@supabase/supabase-js';
import { PublicUser } from "@prisma/client";
import { useUser } from "@/hooks/useUser";

type PostPageProps = {};

const PostPage: FC<PostPageProps> = ({ params }: { params: { community: string, pid: string } }) => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loadingUser } = useUser();
  const router = useRouter();

  const { community, pid } = params
  const { communityStateValue } = useCommunityData();

  const { postStateValue, setPostsStateValue, onDeletePost, loading, setLoading, onVote } = usePosts(communityStateValue.currentCommunity);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', pid)
        .single();

      if (error) throw error;

      setPostsStateValue((prev) => ({
        ...prev,
        selectedPost: { id: data.id, ...data } as Post,
      }));
    } catch (error: any) {
      console.error("fetchPost error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (pid && !postStateValue.selectedPost) {
      fetchPost();
    }
  }, [params, postStateValue.selectedPost]);

  return (
    <PageContentLayout>
      <>
        {loading ? (
          <PostLoader skeletonCount={1} />
        ) : (
          <>
            {postStateValue.selectedPost && (
              <>
                <PostItem
                  post={postStateValue.selectedPost}
                  onVote={onVote}
                  onDeletePost={onDeletePost}
                  userVoteValue={postStateValue.postVotes.find((item) => item.postId === postStateValue.selectedPost!.id)?.voteValue}
                  userIsCreator={user?.id === postStateValue.selectedPost.creatorId}
                  router={router}
                />
                <Comments user={user} community={community as string} selectedPost={postStateValue.selectedPost} />
              </>
            )}
          </>
        )}
      </>
      <>
        <About communityData={communityStateValue.currentCommunity} loading={loading} />
      </>
    </PageContentLayout>
  );
};
export default PostPage;
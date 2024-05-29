import { FC, useEffect } from "react";
import { useAuthState } from "@/hooks/useAuthState";

import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase/client";

import PageContentLayout from "@/components/reddit/Layout/PageContent";
import PostLoader from "@/components/reddit/Loader/PostLoader";
import About from "@/features/Community/About";
import Comments from "@/features/Post/Comments";
import PostItem from "@/features/Post/PostItem";
import useCommunityData from "@/hooks/useCommunityData";
import usePosts from "@/hooks/usePosts";
import { Post } from "@/types/PostState";
import { useState } from "react";
import { Session } from "@supabase/supabase-js";

type PostPageProps = {};

const PostPage: FC<PostPageProps> = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const router = useRouter();
  const { community, pid } = router.query;
  const { communityStateValue } = useCommunityData();

  const { postStateValue, setPostStateValue, onDeletePost, loading, setLoading, onVote } = usePosts(communityStateValue.currentCommunity);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', pid)
        .single();

      if (error) throw error;

      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: data.id, ...data } as Post,
      }));
    } catch (error: any) {
      console.error("fetchPost error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const { pid } = router.query;

    if (pid && !postStateValue.selectedPost) {
      fetchPost();
    }
  }, [router.query, postStateValue.selectedPost]);

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
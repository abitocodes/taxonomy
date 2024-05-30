"use client"

import { FC, useEffect } from "react";
import { useAuthState } from "@/hooks/useAuthState";

import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

import PageContentLayout from "@/components/reddit/Layout/PageContent";
import PostLoader from "@/components/reddit/Loader/PostLoader";
import About from "@/features/Genre/About";
import Comments from "@/features/Post/Comments";
import PostItem from "@/features/Post/PostItem";
import useGenreData from "@/hooks/useGenreData";
import usePosts from "@/hooks/usePosts";
import { Post } from "@prisma/client";
import { useState } from "react";
import { Session } from '@supabase/supabase-js';
import { PublicUser } from "@prisma/client";
import { useUser } from "@/hooks/useUser";

type PostPageProps = {};

const PostPage: FC<PostPageProps> = ({ params }: { params: { genre: string, pid: string } }) => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loadingUser } = useUser();
  const router = useRouter();

  const { genre, pid } = params
  const { genreStateValue } = useGenreData();

  const { postStateValue, setPostsStateValue, onDeletePost, loading, setLoading, onVote } = usePosts(genreStateValue.currentGenre);

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
                <Comments user={user} genre={genre as string} selectedPost={postStateValue.selectedPost} />
              </>
            )}
          </>
        )}
      </>
      <>
        <About genreData={genreStateValue.currentGenre} loading={loading} />
      </>
    </PageContentLayout>
  );
};
export default PostPage;
"use client"

import { FC, useEffect } from "react";
import { useAuthState } from "@/hooks/useAuthState";

import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

import PageContentLayout from "@/components/reddit/Layout/PageContent";
import PostLoader from "@/components/reddit/Loader/PostLoader";
import About from "@/features/Channel/About";
import Comments from "@/features/Post/Comments";
import PostItem from "@/features/Post/PostItem";
import useChannelData from "@/hooks/useChannelData";
import usePosts from "@/hooks/usePosts";
import { Post } from "@prisma/client";
import { useState } from "react";
import { Session } from '@supabase/supabase-js';
import { PublicUser } from "@prisma/client";
import { useUser } from "@/hooks/useUser";
import { LinkableCard } from "@/components/LinkableCard";
import { PostWith } from "@/types/posts";
import { CryptoPriceTable } from "@/components/CryptoPriceTable";

type PostPageProps = {};

const PostPage: FC<PostPageProps> = ({ params }: { params: { channel: string, pid: string } }) => {

  const [session, setSession] = useState<Session | null>(null);
  const { user, loadingUser } = useUser();
  const { channel, pid } = params
  const { channelStateValue } = useChannelData();
  const { postsState, setPostsState, onSelectPost, onDeletePost, loading, setLoading, onVote } = usePosts(channelStateValue.currentChannel);

  const fetchPost = async () => {
    
    setLoading(true);
    try {
      const response = await fetch(`/api/getPost?postId=${pid}`);
      const data = await response.json();
      const postData = data.post

      setPostsState((prev) => ({
        ...prev,
        selectedPost: { id: postData.id, ...postData } as PostWith,
      }));
    } catch (error: any) {
      console.error("fetchPost error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchSessionAndPost = async () => {
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);
      if (data.session) {
        if (pid) {
          fetchPost();
        }
      } else {
        console.log("로그인이 필요합니다.");
      }
    };
  
    fetchSessionAndPost();
  }, [params, postsState.posts]);

  return (
    <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto py-6 pr-2 md:sticky md:block lg:py-10">
        
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full min-w-0">
          <div className="container mx-auto space-y-4">
          {loading ? (
            <PostLoader skeletonCount={1} />
          ) : (
            <>
              {postsState.selectedPost && (
                <>
                      <LinkableCard
                        post={postsState.selectedPost}
                        onVote={onVote}
                        onDeletePost={onDeletePost}
                        userVoteValue={postsState.postVotes.find((item) => item.postId === postsState.selectedPost!.id)?.voteValue}
                        userIsCreator={user?.id === postsState.selectedPost?.creatorId}
                        onSelectPost={onSelectPost}
                        homePage
                        cursorPointer={false}
                        />
                        <Comments user={user} channel={channel as string} selectedPost={postsState.selectedPost} />
                      </>
                    )}
                  </>
                )}
          </div>
        </div>
        <div className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
            <div className="container mx-auto space-y-4">
              <About channelData={channelStateValue.currentChannel} loading={loading} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default PostPage;
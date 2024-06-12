"use client"

import { FC, useEffect } from "react";
import { useAuthState } from "@/hooks/useAuthState";

import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

import PageContentLayout from "@/components/reddit/Layout/PageContent";
import PostLoader from "@/components/reddit/Loader/PostLoader";
import About from "@/features/Channel/About";
import Comments from "@/components/CommentSection";

import useChannelData from "@/hooks/useChannelData";
import usePostList from "@/hooks/usePostList";
import { Post } from "@prisma/client";
import { useState } from "react";
import { Session } from '@supabase/supabase-js';
import { PublicUser } from "@prisma/client";
import { useUser } from "@/hooks/useUser";
import { PostItem } from "@/components/Post/PostItem";
import { PostWith } from "@/types/post";
import { CryptoPriceTable } from "@/components/CryptoPriceTable";
import { useRecoilValue } from "recoil";
import { globalAuthState } from "@/atoms/globalAuthStateAtom";

type PostPageProps = {};

const PostPage: FC<PostPageProps> = ({ params }: { params: { channel: string, pid: string } }) => {
  const { channel, pid } = params

  const { globalSessionData, globalAuthLoadingState } = useRecoilValue(globalAuthState);
  const { user, loadingUser } = useUser();
  const { channelStateValue, loading: channelLoading } = useChannelData();
  const { 
    postListState,
    setPostListState,
    postListLoading,
    setPostListLoading,
    onSelectPost,
    onDeletePost,
    onVotePost } = usePostList(globalSessionData, globalAuthLoadingState, channelStateValue.currentChannel);


  return (
    <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto py-6 pr-2 md:sticky md:block lg:py-10">
        
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full min-w-0">
          <div className="container mx-auto space-y-4">
          {postListLoading ? (
            <PostLoader skeletonCount={1} />
          ) : (
            <>
              {postListState.selectedPost && (
                <>
                      <PostItem
                        post={postListState.selectedPost}
                        onVotePost={onVotePost}
                        onDeletePost={onDeletePost}
                        globalSessionData={globalSessionData}
                        isAlreadyVoted={postListState.postVotes.find((item) => item.postId === postListState.selectedPost!.id)?.voteValue}
                        isSessionUserCreator={user?.id === postListState.selectedPost?.creatorId}
                        onSelectPost={onSelectPost}
                        homePage
                        cursorPointer={false}
                        />
                        <Comments 
                          user={user} 
                          channel={channel as string} 
                          selectedPost={postListState.selectedPost}
                          />
                      </>
                    )}
                  </>
                )}
          </div>
        </div>
        <div className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
            <div className="container mx-auto space-y-4">
              <About channelData={channelStateValue.currentChannel} loading={channelLoading} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default PostPage;
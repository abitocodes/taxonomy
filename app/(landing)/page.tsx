"use client"
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import PostLoader from "@/components/reddit/Loader/PostLoader";
import usePostList from "@/hooks/usePostList";
import { PostVote } from "@prisma/client";
import { ReactElement } from "react";
import { PostWith } from "@/types/post";
import { PostItem } from "@/components/Post/PostItem";
import { BulletinBoard } from "@/components/BulletinBoard";
import { useAuthState } from "@/hooks/useAuthState";
import { useRecoilValue } from "recoil";
import { globalAuthState } from "@/atoms/globalAuthStateAtom";

export default function Home(): ReactElement {
  const { globalSessionData, globalAuthLoadingState } = useRecoilValue(globalAuthState);

  const { 
          postListState,
          setPostListState,
          postListLoading,
          setPostListLoading,
          onSelectPost,
          onDeletePost,
          onVotePost } = usePostList(globalSessionData, globalAuthLoadingState);
          
  const getHomePostListWithSession = async () => {
    console.log("getHomePostListWithSession Called.")
    setPostListLoading(true);
    try {
      const response = await fetch(`/api/getHomePostListWithSession?userId=${globalSessionData?.user.id}`);
      const { postList, postVotes } = await response.json();
  
      setPostListState((prev) => ({
        ...prev,
        postList: postList as PostWith[],
        postVotes: postVotes as PostVote[],
      }));
    } catch (error: any) {
      console.error("getHomePostListWithSession error", error.message);
    } finally {
      setPostListLoading(false);
    }
  };

  const getHomePostListWithoutSession = async () => {
    console.log("getHomePostListWithoutSession Called.")
    setPostListLoading(true);
    try {
      const response = await fetch('/api/getHomePostListWithoutSession');
      const { postList } = await response.json();
      
      setPostListState((prev) => ({
        ...prev,
        postList: postList as PostWith[],
      }));
    } catch (error: any) {
      console.error("getHomePostListWithoutSession error", error.message);
    } finally {
      setPostListLoading(false);
    }
  };

  useEffect(() => {
    if (!globalAuthLoadingState) {
      if (globalSessionData?.user) {
        getHomePostListWithSession();
      } else if (globalSessionData?.user === null) {
        getHomePostListWithoutSession();
      }
    }
  }, [globalAuthState, globalAuthLoadingState, globalSessionData?.user]);
  
  useEffect(() => {
    return () => {
      setPostListState((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, []);

  return (
    <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto py-6 pr-2 md:sticky md:block lg:py-10">
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full min-w-0">
          <div className="container mx-auto">
            {/* <CreatePostLink /> */}
            {postListLoading || globalAuthLoadingState ? (
              <div>
                <PostLoader />
              </div>
            ) : (
              <div className="space-y-6">
                {(postListState?.postList || []).map((post: PostWith, index: number) => {
                  return (
                    <PostItem
                      key={index}
                      post={post}
                      postIdx={index}
                      onVotePost={onVotePost}
                      onDeletePost={onDeletePost}
                      globalSessionData={globalSessionData}
                      onSelectPost={onSelectPost}
                      homePage
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
          <div className="fixed md:sticky top-36 h-[calc(100vh-3.5rem)] z-30">
              <BulletinBoard/>
          </div>
      </main>
    </div>
  );
}
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
import { useRecoilValue } from "recoil";
import { globalAuthState } from "@/atoms/globalAuthStateAtom";
import { PostList } from "@/components/Post/PostList";

export default function Home(): ReactElement {
  const { globalSessionData, globalAuthLoadingState } = useRecoilValue(globalAuthState);

  const { 
          postListState,
          setPostListState,
          postListLoading,
          setPostListLoading,
          onSelectPost,
          onDeletePost,
          onVotePost 
        } = usePostList(globalSessionData, globalAuthLoadingState);
          
  const getHomePostList = async () => {
    console.log("getHomePostList Called.")
    setPostListLoading(true);
    try {
      const response = await fetch(`/api/getHomePostList?userId=${globalSessionData?.user?.id || ''}`);
      const data = await response.json();
      console.log("data", data)
      if (data.postList) {
        setPostListState((prev) => ({
          ...prev,
          postList: data.postList as PostWith[],
          postVotes: data.postVotes as PostVote[],
        }));
        console.log("postListState", postListState)
      } else {
        setPostListState((prev) => ({
          ...prev,
          postList: data.postList as PostWith[],
        }));
      }
    } catch (error: any) {
      console.error("getHomePostList error", error.message);
    } finally {
      setPostListLoading(false);
    }
  };

  useEffect(() => {
    if (!globalAuthLoadingState) {
      getHomePostList();
    }
  }, [globalAuthLoadingState]);
  

  return (
    <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto py-6 pr-2 md:sticky md:block lg:py-10">
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full min-w-0">
          <div className="container mx-auto">
            {postListLoading || globalAuthLoadingState ? (
              <PostLoader />
            ) : (
              <PostList
                postList={postListState?.postList || []}
                postVotes={postListState?.postVotes || []}
                globalSessionData={globalSessionData}
                onSelectPost={onSelectPost}
                onVotePost={onVotePost}
                onDeletePost={onDeletePost}
              />
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
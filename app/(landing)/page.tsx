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

export default function Home(): ReactElement {
  console.log("Home 실행")
  const { session,
          authLoadingState,
          authErrorMsg,
          postListState,
          setPostListState,
          postListLoading,
          setPostListLoading,
          onSelectPost,
          onDeletePost,
          onVotePost } = usePostList();
          
  const getHomePostListWithSession = async () => {
    console.log("getHomePostListWithSession Called.")
    setPostListLoading(true);
    try {
      const response = await fetch(`/api/getHomePostListWithSession?userId=${session?.user.id}`);
      const { postList } = await response.json();

      setPostListState((prev) => ({
        ...prev,
        postList: postList as PostWith[],
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
    } finally {
      setPostListLoading(false);
    }
  };

  const getUserPostVotes = async () => {
    if (!postListState) {
      return;
    }
    const postIds = postListState.postList.map((post) => post.id);
    try {
      const response = await fetch(`/api/getUserPostVotes?postIds=${postIds}`);
      const data = await response.json();
      const postVotes = Array.isArray(data.postVotes) ? data.postVotes : [];

      setPostListState((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    } catch (error: any) {
      console.error("Error fetching user post votes:", error.message);
    }
  };

  useEffect(() => {
    if (!authLoadingState) {
      if (session?.user) {
        getHomePostListWithSession();
      } else if (session?.user === null) {
        getHomePostListWithoutSession();
      }
    }
  }, [authLoadingState]);

  useEffect(() => {
    if (!session?.user?.id || !postListState.postList ) return;
    getUserPostVotes();
  
    return () => {
      setPostListState((prev) => ({
        ...prev,
        postVotes: [], // 배열로 초기화
      }));
    };
  }, [postListState?.postList, session?.user?.id]);

  return (
    <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto py-6 pr-2 md:sticky md:block lg:py-10">
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full min-w-0">
          <div className="container mx-auto">
            {/* <CreatePostLink /> */}
            {postListLoading || authLoadingState ? (
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
                      isAlreadyVoted={postListState?.postVotes.find((item) => item.postId === post.id)?.voteValue}
                      sessionAndPublicUserState={session?.user?.id === post.creatorId}
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
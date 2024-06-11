"use client"
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import PostLoader from "@/components/reddit/Loader/PostLoader";
import usePosts from "@/hooks/usePosts";
import { PostVote } from "@prisma/client";
import { ReactElement } from "react";
import { PostWith } from "@/types/posts";
import { LinkableCard } from "@/components/LinkableCard";
import { BulletinBoard } from "@/components/BulletinBoard";

export default function Home(): ReactElement {
  const { sessionUser,
          authLoadingState,
          authError,
          postsStateValue,
          setPostsStateValue,
          postsLoading,
          setPostsLoading,
          onSelectPost,
          onDeletePost,
          onVote } = usePosts();

          
  const getUserHomePosts = async () => {
    console.log("getUserHomePosts Called.")
    setPostsLoading(true);
    try {
      const response = await fetch(`/api/getUserHomePosts?userId=${sessionUser?.id}`);
      const data = await response.json();

      const posts = data.posts;
      setPostsStateValue((prev) => {
        const newState = {
          ...prev,
          posts: posts as PostWith[],
        };
        return newState;
      });
      console.log("getUserHomePosts postsStateValue:", postsStateValue);
    } catch (error: any) {
      console.error("getUserHomePosts error", error.message);
    } finally {
      setPostsLoading(false);
    }
  };

  const getNoUserHomePosts = async () => {
    console.log("getNoUserHomePosts Called.")
    setPostsLoading(true);
    try {
      const response = await fetch('/api/getNoUserHomePosts');
      const data = await response.json();
      const posts = data.posts;
      setPostsStateValue((prev) => {
        const newState = {
          ...prev,
          posts: posts as PostWith[],
        };
        return newState;
      });
    } catch (error: any) {
    } finally {
      setPostsLoading(false);
    }
  };

  const getUserPostVotes = async () => {
    if (!postsStateValue) {
      return;
    }
    const postIds = postsStateValue.posts.map((post) => post.id);
    console.log("getUserPostVotes postIds: ", postIds)
    try {
      const response = await fetch(`/api/getUserPostVotes?postIds=${postIds}`);
      const data = await response.json();
      const postVotes = Array.isArray(data.postVotes) ? data.postVotes : [];
      setPostsStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    } catch (error: any) {
      console.error("Error fetching user post votes:", error.message);
    }
  };

  useEffect(() => {
    console.log("useEffect Hook")
    console.log(`Page::authLoadingState ${authLoadingState} sessionUser ${sessionUser}`)
    if (!authLoadingState) {
      if (sessionUser) {
        getUserHomePosts();
      } else if (sessionUser === null) {
        getNoUserHomePosts();
      }
    }
  }, [sessionUser, authLoadingState]);

  useEffect(() => {
    if (!sessionUser?.id || !postsStateValue.posts ) return;
    getUserPostVotes();
  
    return () => {
      setPostsStateValue((prev) => ({
        ...prev,
        postVotes: [], // 배열로 초기화
      }));
    };
  }, [postsStateValue?.posts, sessionUser?.id]);

  return (
    <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto py-6 pr-2 md:sticky md:block lg:py-10">
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full min-w-0">
          <div className="container mx-auto">
            {/* <CreatePostLink /> */}
            {postsLoading || authLoadingState ? (
              <div>
                <PostLoader />
              </div>
            ) : (
              <div className="space-y-6">
                {(postsStateValue?.posts || []).map((post: PostWith, index: number) => {
                  return (
                    <LinkableCard
                      key={index}
                      post={post}
                      postIdx={index}
                      onVote={onVote}
                      onDeletePost={onDeletePost}
                      isAlreadyVoted={postsStateValue?.postVotes.find((item) => item.postId === post.id)?.voteValue}
                      sessionAndPublicUserState={sessionUser?.id === post.creatorId}
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
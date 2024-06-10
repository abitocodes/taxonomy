"use client"
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { channelState } from "@/atoms/channelsAtom";
import PageContentLayout from "@/components/reddit/Layout/PageContent";
import PostLoader from "@/components/reddit/Loader/PostLoader";
import CreatePostLink from "@/features/Channel/CreatePostLink";
import PersonalHome from "@/features/Channel/PersonalHome";
import Premium from "@/features/Channel/Premium";
import Recommendations from "@/features/Channel/Recommendations";
import PostItem from "@/features/Post/PostItem";
import SimplePostItem from "@/features/Post/SimplePostItem";
import usePosts from "@/hooks/usePosts";
import { PostVote } from "@prisma/client";
import { useUser } from "@/hooks/useUser";
import { ReactElement } from "react";
import { AppProps } from 'next/app';
import { Session } from '@supabase/supabase-js';
import { useAuthState } from "@/hooks/useAuthState";
import { Container } from "@radix-ui/themes";
import { PostWith } from "@/types/posts";
import { LinkableCard } from "@/components/LinkableCard";
import { DocsSidebarNav } from "@/components/sidebar-nav";
import { docsConfig } from "@/config/docs";
import { CryptoPriceTable } from "@/components/CryptoPriceTable";
import { WelcomeNewbies } from "@/components/WelcomeNewbies";
import { BulletinBoard } from "@/components/BulletinBoard";


export default function Home(): ReactElement {
  const [session, setSession] = useState<Session | null>(null);
  const { sessionUser, authLoadingState, authError } = useAuthState(session);
  const { postStateValue, setPostsStateValue, onVote, onSelectPost, onDeletePost, loading, setLoading } = usePosts();
  const channelStateValue = useRecoilValue(channelState);

  const getUserHomePosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/getUserHomePosts?userId=${sessionUser?.id}`);
      const data = await response.json();
      const posts = data.sortedPosts;
      setPostsStateValue((prev) => {
        const newState = {
          ...prev,
          posts: posts as PostWith[],
        };
        return newState;
      });
      console.log("getUserHomePosts", posts);
    } catch (error: any) {
      console.error("getUserHomePosts error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getNoUserHomePosts = async () => {
    setLoading(true);
    try {
      console.log("what??")
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
      setLoading(false);
    }
  };

  const getUserPostVotes = async () => {
    if (!postStateValue) {
      return;
    }
    const postIds = postStateValue.posts.map((post) => post.id);
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
    if (!channelStateValue.initSnippetsFetched) return;
    if (authLoadingState) return;
    if (sessionUser) {
      getUserHomePosts();
    }
  }, [sessionUser, channelStateValue.initSnippetsFetched]);

  useEffect(() => {
    if (authLoadingState) return;
    if (!sessionUser) {
      getNoUserHomePosts();
    }
  }, [sessionUser]);

  useEffect(() => {
    if (!sessionUser?.id || !postStateValue?.posts.length) return;
    getUserPostVotes();

    return () => {
      setPostsStateValue((prev) => ({
        ...prev,
        postVotes: [], // 배열로 초기화
      }));
    };
  }, [postStateValue?.posts, sessionUser?.id]);

  return (
    <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto py-6 pr-2 md:sticky md:block lg:py-10">
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full min-w-0">
          <div className="container mx-auto">
            {/* <CreatePostLink /> */}
            {loading ? (
              <div>
                <PostLoader />
              </div>
            ) : (
              <div className="space-y-6">
                {(postStateValue?.posts || []).map((post: PostWith, index: number) => {
                  return (
                    <LinkableCard
                      key={index}
                      post={post}
                      postIdx={index}
                      onVote={onVote}
                      onDeletePost={onDeletePost}
                      isAlreadyVoted={postStateValue?.postVotes.find((item) => item.postId === post.id)?.voteValue}
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
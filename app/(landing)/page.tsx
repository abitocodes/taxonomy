"use client"
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { communityState } from "@/atoms/communitiesAtom";
import PageContentLayout from "@/components/reddit/Layout/PageContent";
import PostLoader from "@/components/reddit/Loader/PostLoader";
import CreatePostLink from "@/features/Community/CreatePostLink";
import PersonalHome from "@/features/Community/PersonalHome";
import Premium from "@/features/Community/Premium";
import Recommendations from "@/features/Community/Recommendations";
import PostItem from "@/features/Post/PostItem";
import usePosts from "@/hooks/usePosts";
import { Post, PostVote } from "@/types/PostState";
import { useUser } from "@/hooks/useUser";
import { ReactElement } from "react";
import { AppProps } from 'next/app';
import { PostState } from "@/types/PostState";
import { Session } from "@supabase/supabase-js";
import { useAuthState } from "@/hooks/useAuthState";

export default function Home(): ReactElement {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const { postStateValue, setPostStateValue, onVote, onSelectPost, onDeletePost, loading, setLoading } = usePosts();
  const communityStateValue = useRecoilValue(communityState);

  const getUserHomePosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getUserHomePosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user?.id, communityIds: communityStateValue.mySnippets.map(snippet => snippet.communityId) })
      });
      const posts = await response.json();
      setPostStateValue((prev) => {
        const newState = {
          ...prev,
          posts: posts as Post[],
        };
        console.log("Updated postStateValue", newState);
        return newState;
      });
    } catch (error: any) {
      console.error("getNoUserHomePosts error", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const getNoUserHomePosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getNoUserHomePosts');
      const data = await response.json();
      const posts = data.posts
      setPostStateValue((prev) => {
        const newState = {
          ...prev,
          posts: posts as Post[],
        };
        return newState;
      });
    } catch (error: any) {
      console.error("getNoUserHomePosts error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserPostVotes = async () => {
    if (!postStateValue) return;
    const postIds = postStateValue.posts.map((post) => post.id);
    try {
      const response = await fetch('/api/getUserPostVotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user?.id, postIds: postIds })
      });
      const postVotes = await response.json();
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
        selectedPost: prev?.selectedPost ?? null,
        posts: prev?.posts ?? [], // 'undefined' 대신 빈 배열 사용
        postsCache: prev?.postsCache ?? {},
        postUpdateRequired: prev?.postUpdateRequired ?? false
      }));
    } catch (error: any) {
      console.error("Error fetching user post votes:", error.message);
    } finally {
      console.log("getUserPostVotes finished");
    }
  };

  useEffect(() => {
    if (!communityStateValue.initSnippetsFetched) return;

    if (user) {
      getUserHomePosts();
    }
  }, [user, communityStateValue.initSnippetsFetched]);

  useEffect(() => {
    if (!user && !authLoading) {
      getNoUserHomePosts();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!user?.id || !postStateValue?.posts.length) return;
    getUserPostVotes();
  }, [postStateValue?.posts, user?.id]);

  useEffect(() => {
    if (!user?.id || !postStateValue?.posts.length) return;
    getUserPostVotes();
  
    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
        selectedPost: prev?.selectedPost ?? null,
        posts: prev?.posts ?? [], // 'undefined' 대신 빈 배열 사용
        postsCache: prev?.postsCache ?? {},
        postUpdateRequired: prev?.postUpdateRequired ?? false
      }));
    };
  }, [postStateValue?.posts, user?.id]);

  return (
    <PageContentLayout>
      <>
        <CreatePostLink />
        {loading ? (
          <div>
          <PostLoader />
          </div>
        ) : (
          <div>
          <div className="space-y-4">
          {(postStateValue?.posts || []).map((post: Post, index) => (
            <PostItem
              key={post.id}
              post={post}
              postIdx={index}
              onVote={onVote}
              onDeletePost={onDeletePost}
              userVoteValue={postStateValue?.postVotes.find((item) => item.postId === post.id)?.voteValue}
              userIsCreator={user?.id === post.creatorId}
              onSelectPost={onSelectPost}
              homePage
            />
          ))}
        </div>
        </div>
        )}
      </>
      <div className="sticky top-14 space-y-5">
        <Recommendations />
        <Premium />
        <PersonalHome />
      </div>
    </PageContentLayout>
  );
};

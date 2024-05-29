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
import { PostVote } from "@prisma/client";
import { useUser } from "@/hooks/useUser";
import { ReactElement } from "react";
import { AppProps } from 'next/app';
import { Session } from "@supabase/supabase-js";
import { useAuthState } from "@/hooks/useAuthState";
import { Container } from "@radix-ui/themes";

import { PostWith } from "@/types/Post";

export default function Home(): ReactElement {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const { postStateValue, setPostsStateValue, onVote, onSelectPost, onDeletePost, loading, setLoading } = usePosts();
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
      setPostsStateValue((prev) => {
        const newState = {
          ...prev,
          posts: posts as PostWith[],
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
      setPostsStateValue((prev) => {
        const newState = {
          ...prev,
          posts: posts as PostWith[],
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
    console.log("getUserPostVotes called");
    if (!postStateValue) {
      console.log("postStateValue is undefined");
      return;
    }
    const postIds = postStateValue.posts.map((post) => post.id);
    try {
      const response = await fetch(`/api/getUserPostVotes?postIds=${postIds}`);
      const data = await response.json();
      const postVotes = data.postVotes;
      setPostsStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
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
  
    return () => {
      setPostsStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [postStateValue?.posts, user?.id]);

  return (
    <PageContentLayout>
      <Container>
        <CreatePostLink />
      {loading ? (
        <div>
        <PostLoader />
        </div>
      ) : (
        <div className="space-y-6">
        {(postStateValue?.posts || []).map((post: PostWith, index: number) => (
          <PostItem
            key={index}
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
      )}
      </Container>
      <Container className="sticky top-14 space-y-5">
        <Recommendations />
        <Premium />
        <PersonalHome />
      </Container>
    </PageContentLayout>
  );
};

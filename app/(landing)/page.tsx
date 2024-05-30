"use client"
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { genreState } from "@/atoms/genresAtom";
import PageContentLayout from "@/components/reddit/Layout/PageContent";
import PostLoader from "@/components/reddit/Loader/PostLoader";
import CreatePostLink from "@/features/Genre/CreatePostLink";
import PersonalHome from "@/features/Genre/PersonalHome";
import Premium from "@/features/Genre/Premium";
import Recommendations from "@/features/Genre/Recommendations";
import PostItem from "@/features/Post/PostItem";
import SimplePostItem from "@/features/Post/SimplePostItem";
import usePosts from "@/hooks/usePosts";
import { post_votes } from "@prisma/client";
import { useUser } from "@/hooks/useUser";
import { ReactElement } from "react";
import { AppProps } from 'next/app';
import { Session } from '@supabase/supabase-js';
import { useAuthState } from "@/hooks/useAuthState";
import { Container } from "@radix-ui/themes";

import { PostWith } from "@/types/Post";

export default function Home(): ReactElement {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const { postStateValue, setPostsStateValue, onVote, onSelectPost, onDeletePost, loading, setLoading } = usePosts();
  const genreStateValue = useRecoilValue(genreState);

  const getUserHomePosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getUserHomePosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user?.id, genreIds: genreStateValue.mySnippets.map(snippet => snippet.genreId) })
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
    // console.log("getUserPostVotes called");
    if (!postStateValue) {
      console.log("postStateValue is undefined");
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
    } finally {
      // console.log("getUserPostVotes finished");
    }
  };

  useEffect(() => {
    if (!genreStateValue.initSnippetsFetched) return;

    if (user) {
      getUserHomePosts();
    }
  }, [user, genreStateValue.initSnippetsFetched]);

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
        postVotes: [] // 배열로 초기화
      }));
    };
  }, [postStateValue?.posts, user?.id]);

  return (
    <PageContentLayout>
      <Container>
        {/* <CreatePostLink /> */}
      {loading ? (
        <div>
        <PostLoader />
        </div>
      ) : (
        <div className="space-y-6">
        {(postStateValue?.posts || []).map((post: PostWith, index: number) => { 
          // console.log("postVotes after <PostLoader/> rendered: ", postStateValue.postVotes)
          return (
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
        )})}
      </div>
      )}
      </Container>
      {/* <Container className="sticky top-14 space-y-5"> */}
      <Container className="space-y-5">
        <Recommendations />
        <Premium />
        <PersonalHome />
      </Container>
    </PageContentLayout>
  );
};



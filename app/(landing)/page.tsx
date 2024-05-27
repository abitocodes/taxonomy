"use client"
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
import { prisma } from "@/prisma/client";
import { useUser } from "@/hooks/useUser";
import { ReactElement } from "react";
import { RecoilRoot } from 'recoil';
import { AppProps } from 'next/app';
import { PostState } from "@/types/PostState";

export default function Home(): ReactElement {
  const { user, loadingUser } = useUser();
  const communityStateValue = useRecoilValue(communityState);
  // const { postStateValue, setPostStateValue, onVote, onSelectPost, onDeletePost, loading, setLoading } = usePosts();
  const [postStateValue, setPostStateValue] = useState<PostState | undefined>(undefined);
  const [onVote, setOnVote] = useState<(event: React.MouseEvent<SVGElement, MouseEvent>, post: Post, vote: number, communityId: string, postIdx?: number) => void>(() => {});
  const [onDeletePost, setOnDeletePost] = useState<(post: Post) => Promise<boolean>>(async () => true);
  const [onSelectPost, setOnSelectPost] = useState<(value: Post, postIdx: number) => void>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initPosts = async () => {
      const { postStateValue, onVote, onSelectPost, onDeletePost, loading } = usePosts();
      setPostStateValue(postStateValue);
      setOnVote(onVote);
      setOnSelectPost(onSelectPost);
      setOnDeletePost(await onDeletePost);
      setLoading(loading);
    };
  
    initPosts();
  }, []);

  const getUserHomePosts = async () => {
    setLoading(true);
    try {
      let whereClause = {};
  
      if (communityStateValue.mySnippets.length) {
        const myCommunityIds = communityStateValue.mySnippets.map((snippet) => snippet.communityId);
        whereClause = {
          communityId: {
            in: myCommunityIds
          }
        };
      }
  
      const posts = await prisma.post.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      });
  
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
        selectedPost: prev?.selectedPost ?? null, // null이나 기존 값 사용
        postVotes: prev?.postVotes ?? [],
        postsCache: prev?.postsCache ?? {},
        postUpdateRequired: prev?.postUpdateRequired ?? false
      }));
    } catch (error: any) {
      console.error("getUserHomePosts error", error.message);
    }
    setLoading(false);
  };

  const getNoUserHomePosts = async () => {
    setLoading(true);
    try {
      const posts = await prisma.post.findMany({
        orderBy: { voteStatus: 'desc' },
        take: 10
      });

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
        selectedPost: prev?.selectedPost ?? null, // null이나 기존 값 사용
        postVotes: prev?.postVotes ?? [],
        postsCache: prev?.postsCache ?? {},
        postUpdateRequired: prev?.postUpdateRequired ?? false
      }));
    } catch (error: any) {
      console.error("getNoUserHomePosts error", error.message);
    }
    setLoading(false);
  };

  const getUserPostVotes = async () => {
    if (!postStateValue) return;
    const postIds = postStateValue.posts.map((post) => post.id);
    try {
      const postVotes = await prisma.postVote.findMany({
        where: {
          postId: { in: postIds },
          userId: user?.id
        }
      });
  
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
        selectedPost: prev?.selectedPost ?? null,
        posts: prev?.posts ?? [], // 'undefined' 대신 빈 배열 사용
        postsCache: prev?.postsCache ?? {},
        postUpdateRequired: prev?.postUpdateRequired ?? false
      }));
    } catch (error) {
      console.error("Error fetching user post votes:", error.message);
    }
  };

  useEffect(() => {
    if (!communityStateValue.initSnippetsFetched) return;

    if (user) {
      getUserHomePosts();
    }
  }, [user, communityStateValue.initSnippetsFetched]);

  useEffect(() => {
    if (!user && !loadingUser) {
      getNoUserHomePosts();
    }
  }, [user, loadingUser]);

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
    <RecoilRoot>
    <PageContentLayout>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
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
        )}
      </>
      <div className="sticky top-14 space-y-5">
        <Recommendations />
        <Premium />
        <PersonalHome />
      </div>
    </PageContentLayout>
    </RecoilRoot>
  );
};

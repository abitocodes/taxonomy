"use client"
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
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

export default function Home(): ReactElement {
  const { user, loadingUser } = useUser();
  const { postStateValue, setPostStateValue, onVote, onSelectPost, onDeletePost, loading, setLoading } = usePosts();
  const communityStateValue = useRecoilValue(communityState);

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
      }));
    } catch (error: any) {
      console.error("getNoUserHomePosts error", error.message);
    }
    setLoading(false);
  };

  const getUserPostVotes = async () => {
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
    if (!user?.id || !postStateValue.posts.length) return;
    getUserPostVotes();

    return () => {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [postStateValue.posts, user?.id]);

  return (
    <RecoilRoot>
    <PageContentLayout>
      <>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ) : (
          <div className="space-y-4">
            {postStateValue.posts.map((post: Post, index) => (
              <PostItem
                key={post.id}
                post={post}
                postIdx={index}
                onVote={onVote}
                onDeletePost={onDeletePost}
                userVoteValue={postStateValue.postVotes.find((item) => item.postId === post.id)?.voteValue}
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

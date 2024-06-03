/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { useRouter } from "next/navigation";

import { authModalState } from "@/atoms/authModalAtom";
import { genreState } from "@/atoms/genresAtom";
import { postState } from "@/atoms/postsAtom";
import { supabase } from "@/utils/supabase/client";
import { Genre } from "@/types/genresState";
import { Post, PostVote } from "@prisma/client";
import { PostWith } from "@/types/posts";
import { RecoilRoot } from 'recoil';
import { AppProps } from 'next/app';
import { Session } from '@supabase/supabase-js';
import { prisma } from "@/prisma/client";

export default function usePosts (genreData?: Genre) {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const [postStateValue, setPostsStateValue] = useRecoilState(postState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const genreStateValue = useRecoilValue(genreState);

  const onSelectPost = (post: PostWith, postIdx: number) => {
    setPostsStateValue((prev) => ({
      ...prev,
      selectedPost: { ...post, postIdx },
    }));
    router.push(`/g/${post.genreId}/comments/${post.id}`);
  };

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: PostWith,
    vote: number,
    genreId: string
  ) => {
    event.stopPropagation();
    if (!user?.id) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
  
    const { voteStatus } = post;
    const existingVote = postStateValue.postVotes.find((v) => v.postId === post.id);
  
    try {
      const response = await fetch(`/api/vote?postId=${post.id}&userId=${user.id}&voteValue=${vote}&genreId=${genreId}`, {
        method: 'GET'
      });
  
      if (!response.ok) {
        throw new Error('투표 처리 실패');
      }
  
      const voteResult = await response.json();
      const voteChange = voteResult.voteValue - (existingVote ? existingVote.voteValue : 0);
  
      const updatedPost = { ...post, voteStatus: (post.voteStatus || 0) + voteChange };
      const updatedPosts = [...postStateValue.posts];
      const postIdx = updatedPosts.findIndex((item) => item.id === post.id);
      updatedPosts[postIdx] = updatedPost;
  
      let updatedPostVotes = [...postStateValue.postVotes];
      if (!existingVote) {
        updatedPostVotes.push(voteResult);
      } else {
        const voteIdx = updatedPostVotes.findIndex((v) => v.id === existingVote.id);
        if (voteIdx !== -1) {
          updatedPostVotes[voteIdx] = voteResult;
        }
      }
  
      const updatedState = {
        ...postStateValue,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
        postsCache: {
          ...postStateValue.postsCache,
          [genreId]: updatedPosts,
        },
        selectedPost: updatedPost
      };
  
      setPostsStateValue(updatedState);
    } catch (error) {
      console.error("onVote error", error);
    }
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      if (post.mediaURL) {
        await supabase
        .storage
        .from('posts')
        .remove([`media/${post.id}`]);
    }

    const response = await fetch(`/api/deletePost?postId=${post.id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }

    setPostsStateValue((prev) => ({
      ...prev,
      posts: prev.posts.filter((item) => item.id !== post.id),
      postsCache: {
        ...prev.postsCache,
        [post.genreId]: prev.postsCache[post.genreId]?.filter((item) => item.id !== post.id),
      },
    }));

    return true;
  } catch (error) {
    console.error("onDeletePost error", error);
    return false;
  }
};

const getGenrePostVotes = async (genreId: string) => {
  const user = session?.user
  if (!user) return;

  const response = await fetch(`/api/getGenrePostVotes?genreId=${genreId}&userId=${user.id}`);
  if (!response.ok) {
    console.error('Failed to fetch post votes');
    return;
  }
  const postVotes: PostVote[] = await response.json();
  setPostsStateValue((prev) => ({
    ...prev,
    postVotes: postVotes,
  }));
};

useEffect(() => {
  if (!user?.id || !genreStateValue.currentGenre) return;
  getGenrePostVotes(genreStateValue.currentGenre.id);
}, [user, genreStateValue.currentGenre]);

useEffect(() => {
  if (!user?.id) {
    setPostsStateValue((prev) => ({
      ...prev,
      postVotes: [],
    }));
  }
}, [user]);

return {
  postStateValue,
  setPostsStateValue,
  onSelectPost,
  onDeletePost,
  loading,
  setLoading,
  onVote,
  error,
};
};
         
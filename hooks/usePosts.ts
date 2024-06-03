/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { useRouter } from "next/navigation";

import { authModalState } from "@/atoms/authModalAtom";
import { channelState } from "@/atoms/channelsAtom";
import { postState } from "@/atoms/postsAtom";
import { supabase } from "@/utils/supabase/client";
import { Channel } from "@/types/channelsState";
import { Post, PostVote } from "@prisma/client";
import { PostWith } from "@/types/posts";
import { RecoilRoot } from 'recoil';
import { AppProps } from 'next/app';
import { Session } from '@supabase/supabase-js';
import { prisma } from "@/prisma/client";

export default function usePosts (channelData?: Channel) {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const [postStateValue, setPostsStateValue] = useRecoilState(postState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const channelStateValue = useRecoilValue(channelState);

  const onSelectPost = (post: PostWith, postIdx: number) => {
    setPostsStateValue((prev) => ({
      ...prev,
      selectedPost: { ...post, postIdx },
    }));
    router.push(`/ch/${post.channelId}/comments/${post.id}`);
  };

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: PostWith,
    vote: number,
    channelId: string
  ) => {
    event.stopPropagation();
    if (!user?.id) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
  
    const { voteStatus } = post;
    const existingVote = postStateValue.postVotes.find((v) => v.postId === post.id);
  
    try {
      const response = await fetch(`/api/vote?postId=${post.id}&userId=${user.id}&voteValue=${vote}&channelId=${channelId}`, {
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
          [channelId]: updatedPosts,
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
        [post.channelId]: prev.postsCache[post.channelId]?.filter((item) => item.id !== post.id),
      },
    }));

    return true;
  } catch (error) {
    console.error("onDeletePost error", error);
    return false;
  }
};

const getChannelPostVotes = async (channelId: string) => {
  const user = session?.user
  if (!user) return;

  const response = await fetch(`/api/getChannelPostVotes?channelId=${channelId}&userId=${user.id}`);
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
  if (!user?.id || !channelStateValue.currentChannel) return;
  getChannelPostVotes(channelStateValue.currentChannel.id);
}, [user, channelStateValue.currentChannel]);

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
         
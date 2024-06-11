/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { useRouter } from "next/navigation";

import { authModalState } from "@/atoms/auth/authModalAtom";
import { channelState } from "@/atoms/channelsAtom";
import { postState } from "@/atoms/postsAtom";
import { supabase } from "@/utils/supabase/client";
import { Channel } from "@/types/channelsState";
import { Post, PostVote } from "@prisma/client";
import { PostWith } from "@/types/posts";
import { Session } from '@supabase/supabase-js';
import { SessionAndPublicUserStateType } from "@/types/atoms/SessionAndPublicUserStateType";

export default function usePosts (channelData?: Channel) {
  const [session, setSession] = useState<Session | null>(null);
  const { sessionUser, authLoadingState, authError } = useAuthState(session);

  const [postsState, setPostsState] = useRecoilState(postState);
  const [postsLoading, setPostsLoading] = useState(false);

  const [error, setError] = useState("");
  const router = useRouter();

  const setAuthModalState = useSetRecoilState(authModalState);
  const channelStateValue = useRecoilValue(channelState);

  const onSelectPost = (post: PostWith, postIdx: number) => {
    setPostsState((prev) => ({
      ...prev,
      selectedPost: { ...post, postIdx },
    }));
    router.push(`/ch/${post.channelId}/comments/${post.id}`);
  };

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: PostWith,
    sessionAndPublicUser: SessionAndPublicUserStateType | null
  ) => {
    event.stopPropagation();

    if (!sessionUser?.id) {
      setAuthModalState((prev) => ({ ...prev, emailInputModalOpen: true }));
      return;
    }

    const existingVote = postsState.postVotes.find((v) => v.postId === post.id);

    try {
      const response = await fetch(`/api/vote?postId=${post.id}&userId=${sessionUser?.id}`);
      const data = await response.json();
      if (!response.ok) throw new Error('투표 처리 실패');

      const voteResult = data.voteResult;
      if (voteResult) {
        updatePostVotes(post, voteResult, existingVote, postsState, setPostsState);
      } else {
        removePostVote(post, existingVote, postsState, setPostsState);
      }
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

    setPostsState((prev) => ({
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
  setPostsState((prev) => ({
    ...prev,
    postVotes: postVotes,
  }));
};

useEffect(() => {
  if (!sessionUser?.id || !channelStateValue.currentChannel) return;
  getChannelPostVotes(channelStateValue.currentChannel.id);
}, [sessionUser, channelStateValue.currentChannel]);

useEffect(() => {
  if (!sessionUser?.id) {
    setPostsState((prev) => ({
      ...prev,
      postVotes: [],
    }));
  }
}, [sessionUser]);

return {
  sessionUser,
  authLoadingState,
  authError,
  postsState,
  setPostsState,
  postsLoading,
  setPostsLoading,
  onSelectPost,
  onDeletePost,
  onVote,
  error,
};
};

const updatePostVotes = (
  post: PostWith,
  voteResult: PostVote,
  existingVote: PostVote | undefined,
  postsState: any,
  setPostsState: any
) => {
  const voteChange = voteResult.voteValue - (existingVote ? existingVote.voteValue : 0);
  const updatedPost = { ...post, voteStatus: (post.voteStatus || 0) + voteChange };
  const updatedPosts = postsState.posts.map((p) => (p.id === post.id ? updatedPost : p));

  const updatedPostVotes = existingVote
    ? postsState.postVotes.map((v) => (v.id === existingVote.id ? voteResult : v))
    : [...postsState.postVotes, voteResult];

  setPostsState((prev) => ({
    ...prev,
    posts: updatedPosts,
    postVotes: updatedPostVotes,
    selectedPost: updatedPost,
  }));
};

const removePostVote = (
  post: PostWith,
  existingVote: PostVote | undefined,
  postsState: any,
  setPostsState: any
) => {
  const updatedPosts = postsState.posts.map((p) =>
    p.id === post.id ? { ...p, voteStatus: (p.voteStatus || 0) - (existingVote ? existingVote.voteValue : 0) } : p
  );

  const updatedPostVotes = postsState.postVotes.filter((v) => v.postId !== post.id);

  setPostsState((prev) => ({
    ...prev,
    posts: updatedPosts,
    postVotes: updatedPostVotes,
    selectedPost: null,
  }));
};
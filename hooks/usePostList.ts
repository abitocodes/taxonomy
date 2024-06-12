/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/auth/authModalAtom";
import { channelState } from "@/atoms/channelsAtom";
import { postListState } from "@/atoms/postListAtom";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

import { Post, PostVote } from "@prisma/client";
import { PostWith } from "@/types/post";

export default function usePostList (globalSession, globalAuthLoadingState, channel?) {
  const [_postListState, _setPostListState] = useRecoilState(postListState);
  const [postListLoading, setPostListLoading] = useState(false);

  const [error, setError] = useState("");
  const router = useRouter();

  const setAuthModalState = useSetRecoilState(authModalState);
  const channelStateValue = useRecoilValue(channelState);

  const onSelectPost = (post: PostWith, postIdx: number) => {
    _setPostListState((prev) => ({
      ...prev,
      selectedPost: { ...post, postIdx },
    }));
    router.push(`/ch/${post.channelId}/comments/${post.id}`);
  };

  const onVotePost = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: PostWith,
  ) => {
    event.stopPropagation();

    if (!globalSession?.user) {
      setAuthModalState((prev) => ({ ...prev, emailInputModalOpen: true }));
      return;
    }

    const isAlreadyVoted = _postListState.postVotes.find((v) => v.postId === post.id);

    try {
      const response = await fetch(`/api/votePost?postId=${post.id}&userId=${globalSession?.user.id}`);
      const { voteResult } = await response.json();

      if (!response.ok) throw new Error('votePost Failed.');

      if (voteResult) {
        updatePostVotes(post, voteResult, isAlreadyVoted, _postListState, _setPostListState);
      } else {
        removePostVote(post, isAlreadyVoted, _postListState, _setPostListState);
      }
    } catch (error) {
      console.error("onVotePost error", error);
    }
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      if (post.mediaURL) {
        await supabase
        .storage
        .from('postList')
        .remove([`media/${post.id}`]);
    }

    const response = await fetch(`/api/deletePost?postId=${post.id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }

    _setPostListState((prev) => ({
      ...prev,
      postList: prev.postList.filter((item) => item.id !== post.id),
      postListCache: {
        ...prev.postListCache,
        [post.channelId]: prev.postListCache[post.channelId]?.filter((item) => item.id !== post.id),
      },
    }));

    return true;
  } catch (error) {
    console.error("onDeletePost error", error);
    return false;
  }
};

const getChannelPostVotes = async (channelId: string) => {
  const user = globalSession?.user
  if (!user) return;

  const response = await fetch(`/api/getChannelPostVotes?channelId=${channelId}&userId=${user.id}`);
  if (!response.ok) {
    console.error('Failed to fetch post votes');
    return;
  }
  const postVotes: PostVote[] = await response.json();
  _setPostListState((prev) => ({
    ...prev,
    postVotes: postVotes,
  }));
};

useEffect(() => {
  if (!globalSession?.user?.id || !channelStateValue.currentChannel) return;
  getChannelPostVotes(channelStateValue.currentChannel.id);
}, [globalSession?.user?.id, channelStateValue.currentChannel]);

useEffect(() => {
  if (!globalSession?.user?.id) {
    _setPostListState((prev) => ({
      ...prev,
      postVotes: [],
    }));
  }
}, [globalSession?.user?.id]);

return {
  postListState: _postListState,
  setPostListState: _setPostListState,
  postListLoading,
  setPostListLoading,
  onSelectPost,
  onDeletePost,
  onVotePost,
  error,
};
};

const updatePostVotes = (
  post: PostWith,
  voteResult: PostVote,
  isAlreadyVoted: PostVote | undefined,
  _postListState: any,
  _setPostListState: any
) => {
  const voteChange = voteResult.voteValue - (isAlreadyVoted ? isAlreadyVoted.voteValue : 0);
  const updatedPost = { ...post, voteStatus: (post.voteStatus || 0) + voteChange };
  const updatedPostList = _postListState.postList.map((p) => (p.id === post.id ? updatedPost : p));

  const updatedPostVotes = isAlreadyVoted
    ? _postListState.postVotes.map((v) => (v.id === isAlreadyVoted.id ? voteResult : v))
    : [..._postListState.postVotes, voteResult];

  _setPostListState((prev) => ({
    ...prev,
    postList: updatedPostList,
    postVotes: updatedPostVotes,
    selectedPost: updatedPost,
  }));
};

const removePostVote = (
  post: PostWith,
  isAlreadyVoted: PostVote | undefined,
  _postListState: any,
  _setPostListState: any
) => {
  const updatedPostList = _postListState.postList.map((p) =>
    p.id === post.id ? { ...p, voteStatus: (p.voteStatus || 0) - (isAlreadyVoted ? isAlreadyVoted.voteValue : 0) } : p
  );

  const updatedPostVotes = _postListState.postVotes.filter((v) => v.postId !== post.id);

  _setPostListState((prev) => ({
    ...prev,
    postList: updatedPostList,
    postVotes: updatedPostVotes,
    selectedPost: null,
  }));
};
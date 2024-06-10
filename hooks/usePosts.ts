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
import { sessionAndPublicUserState } from "@/atoms/sessionAndUserAtom";
import { SessionAndPublicUserStateType } from "@/types/atoms/SessionAndPublicUserStateType";

export default function usePosts (channelData?: Channel) {
  const [session, setSession] = useState<Session | null>(null);
  const { sessionUser, authLoadingState, authError } = useAuthState(session);
  const [postsStateValue, setPostsStateValue] = useRecoilState(postState);
  const sessionAndPublicUserStateValue = useRecoilValue(sessionAndPublicUserState);
  
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const setAuthModalState = useSetRecoilState(authModalState);
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
    sessionAndPublicUser: SessionAndPublicUserStateType | null
  ) => {
    console.log("onVote usePosts Called.")
    event.stopPropagation();

    console.log("A")
    if (!sessionUser?.id) {
      setAuthModalState((prev) => ({ ...prev, emailInputModalOpen: true }));
      return;
    }
  
    console.log("B")
    const existingVote = postsStateValue.postVotes.find((v) => v.postId === post.id);
  
    try {
      console.log("C")
      console.log("postId: ", post.id)
      console.log("userId: ", sessionUser?.id)
      const response = await fetch(`/api/vote?postId=${post.id}&userId=${sessionUser?.id}`)
      console.log("response: ", response)
      const data = await response.json();
      console.log("data: ", data)
      if (!response.ok) {
        throw new Error('투표 처리 실패');
      }
   
      const voteResult = data.voteResult
      console.log("voteResult: ", voteResult)
      
      if (voteResult) {
        const voteChange = voteResult.voteValue - (existingVote ? existingVote.voteValue : 0);
        const updatedPost = { ...post, voteStatus: (post.voteStatus || 0) + voteChange };
        const updatedPosts = [...postsStateValue.posts];
        const postIdx = updatedPosts.findIndex((item) => item.id === post.id);
        updatedPosts[postIdx] = updatedPost;
  
        let updatedPostVotes = [...postsStateValue.postVotes];
        if (!existingVote) {
          updatedPostVotes.push(voteResult);
        } else {
          const voteIdx = updatedPostVotes.findIndex((v) => v.id === existingVote.id);
          if (voteIdx !== -1) {
            updatedPostVotes[voteIdx] = voteResult;
          }
        }
  
        const updatedState = {
          ...postsStateValue,
          posts: updatedPosts,
          postVotes: updatedPostVotes,
          postsCache: {
            ...postsStateValue.postsCache,
          },
          selectedPost: updatedPost
        };
  
        setPostsStateValue(updatedState);
      } else {
        // 투표가 삭제된 경우
        const updatedPosts = postsStateValue.posts.map(p => {
          if (p.id === post.id) {
            return { ...p, voteStatus: (p.voteStatus || 0) - (existingVote ? existingVote.voteValue : 0) };
          }
          return p;
        });
  
        const updatedPostVotes = postsStateValue.postVotes.filter(v => v.postId !== post.id);
  
        const updatedState = {
          ...postsStateValue,
          posts: updatedPosts,
          postVotes: updatedPostVotes,
          postsCache: {
            ...postsStateValue.postsCache,
          },
          selectedPost: null
        };
  
        setPostsStateValue(updatedState);
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
  if (!sessionUser?.id || !channelStateValue.currentChannel) return;
  getChannelPostVotes(channelStateValue.currentChannel.id);
}, [sessionUser, channelStateValue.currentChannel]);

useEffect(() => {
  if (!sessionUser?.id) {
    setPostsStateValue((prev) => ({
      ...prev,
      postVotes: [],
    }));
  }
}, [sessionUser]);

return {
  sessionUser,
  authLoadingState,
  authError,
  postsStateValue,
  setPostsStateValue,
  postsLoading,
  setPostsLoading,
  onSelectPost,
  onDeletePost,
  onVote,
  error,
};
};
         
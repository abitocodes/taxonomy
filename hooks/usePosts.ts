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
import { userAndSessionState } from "@/atoms/userAtom";

export default function usePosts (channelData?: Channel) {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const [postStateValue, setPostsStateValue] = useRecoilState(postState);
  const userAndSessionStateValue = useRecoilValue(userAndSessionState);

  
  const [loading, setLoading] = useState(false);
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
    channelId: string
  ) => {
    console.log("onVote usePosts Called.")
    event.stopPropagation();

    console.log("A")
    if (!user?.id) {
      setAuthModalState((prev) => ({ ...prev, emailInputModalOpen: true }));
      return;
    }
  
    console.log("B")
    const existingVote = postStateValue.postVotes.find((v) => v.postId === post.id);
  
    try {
      console.log("C")
      console.log("postId: ", post.id)
      console.log("userId: ", user.id)
      console.log("channelId: ", channelId)
      const response = await fetch(`/api/vote?postId=${post.id}&userId=${user.id}&channelId=${channelId}`)
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
      } else {
        // 투표가 삭제된 경우
        const updatedPosts = postStateValue.posts.map(p => {
          if (p.id === post.id) {
            return { ...p, voteStatus: (p.voteStatus || 0) - (existingVote ? existingVote.voteValue : 0) };
          }
          return p;
        });
  
        const updatedPostVotes = postStateValue.postVotes.filter(v => v.postId !== post.id);
  
        const updatedState = {
          ...postStateValue,
          posts: updatedPosts,
          postVotes: updatedPostVotes,
          postsCache: {
            ...postStateValue.postsCache,
            [channelId]: updatedPosts,
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
         
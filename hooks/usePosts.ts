/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { useRouter } from "next/navigation";

import { authModalState } from "@/atoms/authModalAtom";
import { communityState } from "@/atoms/communitiesAtom";
import { postState } from "@/atoms/postsAtom";
import { supabase } from "@/utils/supabase/client";
import { Community } from "@/types/CommunityState";
import { Post, PostVote } from "@/types/PostState";
import { RecoilRoot } from 'recoil';
import { AppProps } from 'next/app';
import { Session } from "@supabase/supabase-js";

const usePosts = (communityData?: Community) => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const communityStateValue = useRecoilValue(communityState);

  const onSelectPost = (post: Post, postIdx: number) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: { ...post, postIdx },
    }));
    router.push(`/r/${post.communityId}/comments/${post.id}`);
  };

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => {
    event.stopPropagation();
    if (!user?.id) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    const { voteStatus } = post;
    const existingVote = postStateValue.postVotes.find((v) => v.postId === post.id);

    try {
      let voteChange = vote;

      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];

      if (!existingVote) {
        const { data: newVote, error } = await supabase
          .from('postVotes')
          .insert([{
            postId: post.id,
            communityId,
            voteValue: vote,
            userId: user.id
          }])
          .single();

        if (error) throw error;

        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        if (existingVote.voteValue === vote) {
          voteChange *= -1;
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter((v) => v.id !== existingVote.id);
          await supabase
            .from('postVotes')
            .delete()
            .match({ id: existingVote.id });
        } else {
          voteChange = 2 * vote;
          updatedPost.voteStatus = voteStatus + 2 * vote;
          const { data: updatedVote, error } = await supabase
            .from('postVotes')
            .update({ voteValue: vote })
            .match({ id: existingVote.id })
            .single();

          if (error) throw error;

          const voteIdx = updatedPostVotes.findIndex((v) => v.id === existingVote.id);
          if (voteIdx !== -1) {
            updatedPostVotes[voteIdx] = updatedVote;
          }
        }
      }

      let updatedState = { ...postStateValue, postVotes: updatedPostVotes };

      const postIdx = updatedPosts.findIndex((item) => item.id === post.id);
      updatedPosts[postIdx] = updatedPost;
      updatedState = {
        ...updatedState,
        posts: updatedPosts,
        postsCache: {
          ...updatedState.postsCache,
          [communityId]: updatedPosts,
        },
      };

      if (updatedState.selectedPost) {
        updatedState = {
          ...updatedState,
          selectedPost: updatedPost,
        };
      }

      setPostStateValue(updatedState);

      await supabase
        .from('posts')
        .update({ voteStatus: voteStatus + voteChange })
        .match({ id: post.id });
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

    const { error } = await supabase
      .from('posts')
      .delete()
      .match({ id: post.id });

    if (error) throw error;

    setPostStateValue((prev) => ({
      ...prev,
      posts: prev.posts.filter((item) => item.id !== post.id),
      postsCache: {
        ...prev.postsCache,
        [post.communityId]: prev.postsCache[post.communityId]?.filter((item) => item.id !== post.id),
      },
    }));

    return true;
  } catch (error) {
    console.error("onDeletePost error", error);
    return false;
  }
};

const getCommunityPostVotes = async (communityId: string) => {
  try {
    const { data: postVotes, error } = await supabase
      .from('postVotes')
      .select('*')
      .eq('communityId', communityId)
      .eq('userId', user?.id);

    if (error) throw error;

    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));
  } catch (error) {
    console.error("getCommunityPostVotes error", error);
  }
};

useEffect(() => {
  if (!user?.id || !communityStateValue.currentCommunity) return;
  getCommunityPostVotes(communityStateValue.currentCommunity.id);
}, [user, communityStateValue.currentCommunity]);

useEffect(() => {
  if (!user?.id) {
    setPostStateValue((prev) => ({
      ...prev,
      postVotes: [],
    }));
  }
}, [user]);

return {
  postStateValue,
  setPostStateValue,
  onSelectPost,
  onDeletePost,
  loading,
  setLoading,
  onVote,
  error,
};
};

export default usePosts;
         
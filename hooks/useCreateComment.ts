import { useState, useCallback } from 'react';
import { useRouter } from "next/router";
import { commentListState } from "@/atoms/commentListAtom";
import { useAuthState } from '@/hooks/useAuthState';
import { Session } from '@supabase/supabase-js';
import { postListState } from '@/atoms/postListAtom';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { globalAuthState } from "@/atoms/globalAuthStateAtom";

const useCreateComment = () => {
  const sessionAndPublicUser = useRecoilValue(globalAuthState);
  const setCommentList = useSetRecoilState(commentListState);
  const setPostList = useSetRecoilState(postListState);

  const [createCommentLoading, setCreateCommentLoading] = useState(false);

  const onCreateComment = useCallback(async (postId, creatorId, commentText: string) => {
    if (!sessionAndPublicUser.globalSessionData) return;

    setCreateCommentLoading(true);
    const queryParams = new URLSearchParams({
      postId: postId,
      creatorId: creatorId,
      text: commentText,
    });

    try {
      const response = await fetch(`/api/createComment?${queryParams.toString()}`);
      const data = await response.json();
      const createdComment = data.comment;

      setCommentList(prev => ({
        ...prev,
        commentList: [createdComment, ...prev.commentList],
        commentVotes: [...prev.commentVotes, createdComment.voteStatus],
      }));

      setPostList(prev => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost!,
          numberOfComments: prev.selectedPost!.numberOfComments + 1,
        }
      }));
    } catch (error) {
      console.error("createComment error", error.message);
    }
    setCreateCommentLoading(false);
  }, [sessionAndPublicUser.globalSessionData]);

  return { onCreateComment, createCommentLoading };
};

export default useCreateComment;
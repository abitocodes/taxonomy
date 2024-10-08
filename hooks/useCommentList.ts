import { useState, useCallback } from 'react';
import { postListState } from '@/atoms/postListAtom';
import { useRecoilState } from 'recoil';
import { globalAuthState } from "@/atoms/globalAuthStateAtom";
import { useRecoilValue } from "recoil";
import { Comment, CommentVote } from '@prisma/client';
import { CommentWith } from '@/types/comment/CommentList';

export const useCommentList = (postId: string) => {
  const { globalSessionData } = useRecoilValue(globalAuthState);
  const [commentListState, setCommentListState] = useState({
    commentList: [],
    commentVotes: [],
    commentListCache: {},
    commentUpdateRequired: true,
  });
  
  const [commentListLoading, setCommentListLoading] = useState(false);
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [_postListState, setPostListState] = useRecoilState(postListState);

  const onVoteComment = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    comment: CommentWith,
  ) => {
    console.log("onVoteComment Called.");
    setIsLoading(true);
    const isAlreadyVoted = commentListState.commentVotes.find((v) => v.commentId === comment.id);

    try {
      const response = await fetch(`/api/voteComment?commentId=${comment.id}&userId=${globalSessionData?.user?.id}`);
      const { voteResult } = await response.json();
      if (!response.ok) throw new Error('voteComment Failed.');

      if (voteResult) {
        updateCommentVotes(comment, voteResult, isAlreadyVoted, commentListState, setCommentListState);
      } else {
        removeCommentVote(comment, isAlreadyVoted, commentListState, setCommentListState);
      }
    } catch (error) {
      console.error("onVotePost error", error);
      setError("onVotePost error");
    }
  };

  const onDeleteComment = useCallback(async (commentId: string) => {
    setIsLoading(true);
    const queryParams = new URLSearchParams({
      commentId,
      postId,
    });

    try {
      const response = await fetch(`/api/deleteComment?${queryParams.toString()}`);
      const data = await response.json();
      const updatedNumberOfCommentList = data.numberOfComments;

      setCommentListState(prev => ({
        ...prev,
        commentList: prev.commentList.filter(comment => comment.id !== commentId),
        commentVotes: prev.commentVotes.filter(vote => vote.commentId !== commentId),
      }));
      setPostListState(prev => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost!,
          numberOfComments: updatedNumberOfCommentList,
        }
      }));
    } catch (error) {
      console.error("onDeleteComment error", error.message);
      setError("onDeleteComment error");
    }
    setIsLoading(false);
  }, [postId, setPostListState]);

  return {
    commentListState,
    setCommentListState,
    commentListLoading,
    setCommentListLoading,
    onDeleteComment,
    onVoteComment,
    error,
  };
};

const updateCommentVotes = (
  comment: Comment,
  voteResult: CommentVote,
  isAlreadyVoted: CommentVote | undefined,
  commentListState: any,
  setCommentListState: any
) => {
  const voteChange = voteResult.voteValue - (isAlreadyVoted ? isAlreadyVoted.voteValue : 0);
  const updatedComment = { ...comment, voteStatus: (comment.voteStatus || 0) + voteChange };
  const updatedCommentList = commentListState.commentList.map((p) => (p.id === comment.id ? updatedComment : p));

  const updatedCommentVotes = isAlreadyVoted
    ? commentListState.commentVotes.map((v) => (v.id === isAlreadyVoted.id ? voteResult : v))
    : [...commentListState.commentVotes, voteResult];

  setCommentListState((prev) => ({
    ...prev,
    commentList: updatedCommentList,
    commentVotes: updatedCommentVotes,
  }));
};

const removeCommentVote = (
  comment: Comment,
  isAlreadyVoted: CommentVote | undefined,
  commentListState: any,
  setCommentListState: any
) => {
  const updatedCommentList = commentListState.commentList.map((p) =>
    p.id === comment.id ? { ...p, voteStatus: (p.voteStatus || 0) - (isAlreadyVoted ? isAlreadyVoted.voteValue : 0) } : p
  );

  const updatedCommentVotes = commentListState.commentVotes.filter((v) => v.commentId !== comment.id);

  setCommentListState((prev) => ({
    ...prev,
    commentList: updatedCommentList,
    commentVotes: updatedCommentVotes,
  }));
};
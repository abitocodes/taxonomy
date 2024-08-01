"use client"

import { FC, useEffect, useState } from "react";
import { PublicUser } from "@prisma/client";
import CommentInput from "@/components/Comment/CommentInput";
import CommentList from "@/components/Comment/CommentList";
import { useCommentList } from "@/hooks/useCommentList";
import { PostWith } from "@/types/post";
import { globalAuthState } from "@/atoms/globalAuthStateAtom";
import { useRecoilValue } from "recoil";
import { ReloadIcon } from "@radix-ui/react-icons";

interface CommentProps {
  user: PublicUser | null;
  selectedPost: PostWith;
}

const Comment: FC<CommentProps> = ({ user, selectedPost: post }) => {
  const { globalSessionData, globalAuthLoadingState } = useRecoilValue(globalAuthState);
  
  const { 
    commentListState,
    setCommentListState, 
    commentListLoading, 
    setCommentListLoading, 
    onVoteComment,
    onDeleteComment, 
    error 
  } = useCommentList(post.id);

  const [commentInput, setCommentInput] = useState("");

  const getCommentList = async () => {
    setCommentListLoading(true);
    try {
      const response = await fetch(`/api/getPostCommentList?postId=${post.id}`);
      const { commentList, commentVotes } = await response.json();
  
      setCommentListState((prev) => ({
        ...prev,
        commentList,
        commentVotes,
      }));
    } catch (error) {
      console.error("fetchCommentList error", error.message);
    }
    setCommentListLoading(false);
  };

  useEffect(() => {
    getCommentList();
  }, [globalAuthState]);

  if (commentListLoading) {
    return <div className="flex justify-center items-center h-full"><ReloadIcon className="animate-spin" /></div>;
  }

  return (
    <div>
      <div className="py-8">
        <CommentList
          commentList={commentListState.commentList || []}
          commentVotes={commentListState.commentVotes || []}
          globalSessionData={globalSessionData}
          onDeleteComment={onDeleteComment}
          onVoteComment={onVoteComment}
        />
      </div>
      <div className="flex flex-col p-2 mb-6 text-sm w-full">
        <CommentInput 
          comment={commentInput} 
          setComment={setCommentInput} 
        />
      </div>
    </div>
  );
};

export default Comment;
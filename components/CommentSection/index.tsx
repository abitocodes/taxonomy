"use client"

import { FC, useEffect, useState } from "react";
import { PublicUser } from "@prisma/client";
import CommentItem from "@/components/CommentSection/CommentItem";
import CommentInput from "@/components/CommentSection/CommentInput";
import { useCommentList } from "@/hooks/useCommentList";
import { CommentWith } from "@/components/CommentSection/CommentItem";
import { PostWith } from "@/types/post";
import { globalAuthState } from "@/atoms/globalAuthStateAtom";
import { useRecoilValue } from "recoil";
import { CommentVote } from "@prisma/client";

interface CommentsProps {
  user: PublicUser | null;
  selectedPost: PostWith;
}

const Comments: FC<CommentsProps> = ({ user, selectedPost: post }) => {
  const { 
    commentListState,
    setCommentListState, 
    commentListLoading, 
    setCommentListLoading, 
    onVoteComment,
    onDeleteComment, 
    error } = useCommentList(post.id);

  const [ commentInput, setCommentInput] = useState("");

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
      setCommentListLoading(false);
    } catch (error) {
      console.error("fetchCommentList error", error.message);
    }
    setCommentListLoading(false);
  };

  const getCommentVotes = async () => {
    if (!commentListState) {
      return;
    }
    const commentIds = commentListState.commentList.map((comment) => comment.id);
    try {
      const response = await fetch(`/api/getUserCommentVotes?commentIds=${commentIds}`);
      const data = await response.json();
      const commentVotes = Array.isArray(data.commentVotes) ? data.commentVotes : [];

      setCommentListState((prev) => ({
        ...prev,
        commentVotes: commentVotes as CommentVote[],
      }));
    } catch (error: any) {
      console.error("Error fetching user comment votes:", error.message);
    }
  };

  useEffect(() => {
    getCommentList()
  }, [globalAuthState]);

  useEffect(() => {
    if (!user?.id || !commentListState.commentList ) return;
    getCommentVotes();
  
    return () => {
      setCommentListState((prev) => ({
        ...prev,
        commentVotes: [], // 배열로 초기화
      }));
    };
  }, [commentListState?.commentList, user?.id]);

  return (
    <div className="p-2 rounded-b-lg">
      <div className="flex flex-col pl-10 pr-4 mb-6 text-sm w-full">
        <CommentInput 
          comment={commentInput} 
          setComment={setCommentInput} 
        />
      </div>
      <div className="space-y-6 p-2">
        {commentListLoading ? (
          <>
            {[0].map((item) => (
              <div key={item}>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {!!commentListState.commentList.length ? (
              <>
                {commentListState.commentList.map((item: CommentWith) => (
                  <CommentItem 
                    key={item.id} 
                    comment={item} 
                    onDeleteComment={() => onDeleteComment(item.id)} 
                    isLoading={commentListLoading} userId={user?.id} 
                    onVoteComment={onVoteComment}
                    />
                ))}
              </>
            ) : (
              <div className="flex flex-col justify-center items-center border-t border-gray-200 p-20">
                <p className="font-bold text-opacity-30 mt-4">
                  아직 코멘트가 없습니다
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Comments;
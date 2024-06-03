"use client"

import { FC, useCallback, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import { authModalState } from "@/atoms/authModalAtom";
import { postState } from "@/atoms/postsAtom";

import { Comment } from "@prisma/client";
import { PostWith } from "@/types/posts";
import { PublicUser } from "@prisma/client";
import CommentItem from "@/features/Post/Comments/CommentItem";
import CommentInput from "@/features/Post/Comments/CommentInput";

import { CommentWith } from "@/features/Post/Comments/CommentItem";

interface CommentsProps {
  user: PublicUser | null;
  genre: string;
  selectedPost: PostWith; // 이 부분을 추가하세요
}

const Comments: FC<CommentsProps> = ({ user, selectedPost: post, genre }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentFetchLoading, setCommentFetchLoading] = useState(false);
  const [commentCreateLoading, setCommentCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState("");
  const setAuthModalState = useSetRecoilState(authModalState);
  const setPostState = useSetRecoilState(postState);

  const onCreateComment = async (comment: string) => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
  
    setCommentCreateLoading(true);
    const queryParams = new URLSearchParams({
      postId: post.id,
      creatorId: user.id,
      text: comment,
      genreId: genre,
    });
  
    try {
      const response = await fetch(`/api/createComment?${queryParams.toString()}`)
      const data = await response.json();
      const createdComment = data.comment;
  
      setComments((prev) => [
        createdComment,
        ...(Array.isArray(prev) ? prev : []),
      ]);
  
    } catch (error) {
      console.error("onCreateComment error", error.message);
    }
    setCommentCreateLoading(false);
  };

  const onDeleteComment = useCallback(
    async (comment: Comment) => {
      setDeleteLoading(comment.id);
      try {
        const queryParams = new URLSearchParams({
          commentId: comment.id,
          postId: post.id
        });
  
        const response = await fetch(`/api/deleteComment?${queryParams.toString()}`)
  
        const data = await response.json();
        const updatedNumberOfComments = data.numberOfComments;
  
        setComments((prev) => prev.filter((item) => item.id !== comment.id));
      } catch (error) {
        console.error("Error deleting comment", error.message);
      }
      setDeleteLoading("");
    },
    [setComments, setPostState]
  );

  const getPostComments = async () => {
    setCommentFetchLoading(true);
    try {
      const response = await fetch(`/api/getPostComments?postId=${post.id}`);
      const data = await response.json();
      const comments = data.comments
      setComments(comments);
    } catch (error) {
      console.error("getPostComments error", error.message);
    }
    setCommentFetchLoading(false);
  };

  useEffect(() => {
    getPostComments();
    
  }, [post.id]);

  return (
    <div className="p-2 rounded-b-lg">
      <div className="flex flex-col pl-10 pr-4 mb-6 text-sm w-full">
        <CommentInput comment={comment} setComment={setComment} loading={commentCreateLoading} user={user} onCreateComment={onCreateComment} />
      </div>
      <div className="space-y-6 p-2">
        {commentFetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <div key={item} className="p-6">
                <div className="w-10 h-10 rounded-full animate-pulse bg-gray-300"></div>
                <div className="mt-4 space-y-4">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {!!comments.length ? (
              <>
                {comments.map((item: CommentWith) => (
                  <CommentItem key={item.id} comment={item} onDeleteComment={onDeleteComment} isLoading={deleteLoading === (item.id as string)} userId={user?.id} />
                ))}
              </>
            ) : (
              <div className="flex flex-col justify-center items-center border-t border-gray-200 p-20">
                <p className="font-bold text-opacity-30">
                  No Comments Yet
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
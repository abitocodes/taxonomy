import { FC, useCallback, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import { authModalState } from "@/atoms/authModalAtom";
import { postState } from "@/atoms/postsAtom";
import { prisma } from "@/prisma/client";

import { supabase } from "@/utils/supabase/client";
import { Comment } from "@prisma/client";
import { Post } from "@prisma/client";
import { PublicUser } from "@prisma/client";
import CommentItem from "@/features/Post/Comments/CommentItem";
import CommentInput from "@/features/Post/Comments/CommentInput";

import { CommentWith } from "@/features/Post/Comments/CommentItem";
import { GiConsoleController } from "react-icons/gi";

type CommentsProps = {
  user?: PublicUser | null;
  selectedPost: Post;
  genre: string;
};

const Comments: FC<CommentsProps> = ({ user, selectedPost, genre }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentFetchLoading, setCommentFetchLoading] = useState(false);
  const [commentCreateLoading, setCommentCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState("");
  const setAuthModalState = useSetRecoilState(authModalState);
  const setPostsState = useSetRecoilState(postState);

  const onCreateComment = async (comment: string) => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setCommentCreateLoading(true);
    try {
      const { data: commentData, error } = await supabase
        .from('comments')
        .insert([
          {
            postId: selectedPost.id,
            creatorId: user.id,
            text: comment,
            genreId: genre,
            postTitle: selectedPost.title,
            createdAt: new Date().toISOString(),
          }
        ]);

      if (error) throw error;

      if (commentData) {
        setComments((prev) => [
          commentData[0],
          ...prev,
        ]);
      } else {
        console.error("No comment data returned from the insert operation.");
      }

      await supabase
        .from('posts')
        .update({ numberOfComments: selectedPost.numberOfComments + 1 })
        .match({ id: selectedPost.id });

      setPostsState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost.numberOfComments + 1,
        } as Post,
        postUpdateRequired: true,
      }));
    } catch (error) {
      console.error("onCreateComment error", error.message);
    }
    setCommentCreateLoading(false);
  };

  const onDeleteComment = useCallback(
    async (comment: Comment) => {
      setDeleteLoading(comment.id);
      try {
        const { error } = await supabase
          .from('comments')
          .delete()
          .match({ id: comment.id });

        if (error) throw error;

        await supabase
          .from('posts')
          .update({ numberOfComments: selectedPost.numberOfComments - 1 })
          .match({ id: selectedPost.id });

        setPostsState((prev) => ({
          ...prev,
          selectedPost: {
            ...prev.selectedPost,
            numberOfComments: prev.selectedPost.numberOfComments - 1,
          } as Post,
          postUpdateRequired: true,
        }));

        setComments((prev) => prev.filter((item) => item.id !== comment.id));
      } catch (error) {
        console.error("Error deleting comment", error.message);
      }
      setDeleteLoading("");
    },
    [setComments, setPostsState]
  );

  const getPostComments = async () => {
    setCommentFetchLoading(true);
    try {
      const data = await prisma.comment.findMany({
        where: {
          postId: selectedPost.id,
        },
        include: {
          publicUsers: {
            select: {
              nickName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
  
      setComments(data);
    } catch (error) {
      console.error("getPostComments error", error.message);
    }
    setCommentFetchLoading(false);
  };

  useEffect(() => {
    getPostComments();
  }, [selectedPost.id]);

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

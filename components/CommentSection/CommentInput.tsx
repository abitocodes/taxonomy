import { FC } from "react";

import AuthButtons from "@/components/reddit/Navbar/RightContent/AuthButtons";
import { Button } from "@/components/ui/button";
import useCreateComment from "@/hooks/useCreateComment";

import { useRecoilValue } from "recoil";
import { globalAuthState } from "@/atoms/globalAuthStateAtom";

interface CommentInputProps {
  comment: string;
  setComment: (comment: string) => void;
}

const CommentInput: FC<CommentInputProps> = ({ comment, setComment }) => {
  const sessionAndPublicUser = useRecoilValue(globalAuthState);

  const { onCreateComment, createCommentLoading } = useCreateComment();
  
  const handleCreateComment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!sessionAndPublicUser.globalSessionData) {
      return;
    }
    await onCreateComment(postId, sessionAndPublicUser.globalPublicUserData.id, comment);
    setComment('');
  };
  return (
    <div className="flex flex-col relative rounded-xl">
      {sessionAndPublicUser.globalPublicUserData ? (
        <>
          <p className="mb-2 font-cpmo uppercase text-muted-foreground">
            Comment as <span className="text-blue-500">{sessionAndPublicUser.globalPublicUserData?.nickName}</span>
          </p>
          <textarea
            className="w-full p-2.5 text-sm border rounded-md min-h-[160px] pb-10 placeholder-gray-500 focus:outline-none focus:focus:border-black"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="남기고 싶은 코멘트."
          />
          <div className="left-0.5 right-0.5 bottom-0.5 flex justify-end bg-gray-100 p-1.5 rounded-b-md">
            <Button
              className={`h-6 px-3 ${!comment.trim().length ? 'opacity-50 cursor-not-allowed' : ''} transition duration-300 ease-in-out`}
              disabled={!comment.trim().length}
              onClick={handleCreateComment}
            >
              {createCommentLoading ? ".. 남기는 중 .." : "코멘트 남기기"}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between border border-gray-100 p-4 rounded-md">
          <p className="font-semibold">Log in or sign up to leave a comment</p>
          <AuthButtons />
        </div>
      )}
    </div>
  );
};

export default CommentInput;

// const onCreateComment = async (commentText: string, sessionAndPublicUser.globalPublicUserDataId: string, channelId: string) => {
//   setIsLoading(true);
//   const queryParams = new URLSearchParams({
//     postId,
//     creatorId: sessionAndPublicUser.globalPublicUserDataId,
//     text: commentText,
//     channelId,
//   });

//   try {
//     const response = await fetch(`/api/createComment?${queryParams.toString()}`);
//     const data = await response.json();
//     const createdComment = data.comment;

//     _setCommentListState(prev => ({
//       ...prev,
//       commentList: [createdComment, ...prev.commentList],
//       commentVotes: [...prev.commentVotes, createdComment.voteStatus],
//     }));

//     setPostListState(prev => ({
//       ...prev,
//       selectedPost: {
//         ...prev.selectedPost!,
//         numberOfComments: prev.selectedPost!.numberOfComments + 1,
//       }
//     }));
//   } catch (error) {
//     console.error("createComment error", error.message);
//   }
//   setIsLoading(false);
// };
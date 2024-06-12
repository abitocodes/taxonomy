import { FC } from "react";

import AuthButtons from "@/components/reddit/Navbar/RightContent/AuthButtons";
import { Button } from "@/components/ui/button";
import useCreateComment from "@/hooks/useCreateComment";

import { useRecoilValue } from "recoil";
import { globalAuthState } from "@/atoms/globalAuthStateAtom";
import { postListState } from "@/atoms/postListAtom";

interface CommentInputProps {
  comment: string;
  setComment: (comment: string) => void;
}

const CommentInput: FC<CommentInputProps> = ({ comment, setComment }) => {
  const _globalAuthState = useRecoilValue(globalAuthState);
  const _postListState = useRecoilValue(postListState);

  const { onCreateComment, createCommentLoading } = useCreateComment();
  
  const handleCreateComment = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!_globalAuthState.globalSessionData) {
      return;
    }
    await onCreateComment(_postListState.selectedPost?.id, _globalAuthState.globalSessionData.user.id, comment);
    setComment('');
  };
  return (
    <div className="flex flex-col relative rounded-xl w-full">
      {_globalAuthState.globalPublicUserData ? (
        <>
          <p className="mb-2 font-cpmo uppercase text-muted-foreground">
            Comment as <span className="text-blue-500">{_globalAuthState.globalPublicUserData?.nickName}</span>
          </p>
          <textarea
            className="w-full p-2.5 text-sm rounded-md min-h-[90px] pb-10 placeholder-gray-500"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="남기고 싶은 코멘트."
          />
          <div className="flex justify-end bg-secondary p-2 rounded-b-md">
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
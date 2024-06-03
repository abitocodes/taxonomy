import { FC } from "react";
import { PublicUser } from "@prisma/client";

import AuthButtons from "@/components/reddit/Navbar/RightContent/AuthButtons";
import { Button } from "@/components/ui/button";

interface CommentInputProps {
  comment: string;
  setComment: (comment: string) => void;
  loading: boolean;
  user?: PublicUser | null; // User 타입 대신 public_users 타입 사용
  onCreateComment: (comment: string) => void;
}

const CommentInput: FC<CommentInputProps> = ({ comment, setComment, loading, user, onCreateComment }) => {
  const handleCreateComment = async () => {
    await onCreateComment(comment);
    setComment(''); // 코멘트 등록 후 입력 필드 초기화
  };
  return (
    <div className="flex flex-col relative">
      {user ? (
        <>
          <p className="mb-2">
            Comment as <span className="text-blue-500">{user?.nickName}</span>
          </p>
          <textarea
            className="w-full p-2.5 text-sm border rounded-md min-h-[160px] pb-10 placeholder-gray-500 focus:outline-none focus:focus:border-black"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="남기고 싶은 말이 있어?"
          />
          <div className="left-0.5 right-0.5 bottom-0.5 flex justify-end bg-gray-100 p-1.5 rounded-b-md">
            <Button
              className={`h-6 px-3 ${!comment.trim().length ? 'opacity-50 cursor-not-allowed' : ''} transition duration-300 ease-in-out`}
              disabled={!comment.trim().length}
              onClick={handleCreateComment}
            >
              {loading ? ".. 남기는 중 .." : "코멘트 남기기"}
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
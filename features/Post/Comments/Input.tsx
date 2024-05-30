import { FC } from "react";
import { PublicUser } from "@prisma/client";

import AuthButtons from "@/components/reddit/Navbar/RightContent/AuthButtons";

interface CommentInputProps {
  comment: string;
  setComment: (comment: string) => void;
  loading: boolean;
  user?: PublicUser | null; // User 타입 대신 PublicUser 타입 사용
  onCreateComment: (comment: string) => void;
}

const CommentInput: FC<CommentInputProps> = ({ comment, setComment, loading, user, onCreateComment }) => {
  return (
    <div className="flex flex-col relative">
      {user ? (
        <>
          <p className="mb-1">
            Comment as <span className="text-blue-500">{user?.email?.split("@")[0]}</span>
          </p>
          <textarea
            className="w-full p-2.5 text-sm border rounded-md min-h-[160px] pb-10 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-black"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="What are your thoughts?"
          />
          <div className="absolute left-0.5 right-0.5 bottom-0.5 flex justify-end bg-gray-100 p-1.5 rounded-b-md">
            <button
              className={`h-6 px-3 ${!comment.trim().length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:text-white'} transition duration-300 ease-in-out`}
              disabled={!comment.trim().length}
              onClick={() => onCreateComment(comment)}
            >
              {loading ? "Loading..." : "Comment"}
            </button>
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
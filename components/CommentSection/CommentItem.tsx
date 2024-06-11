import { FC } from "react";
import { FaReddit } from "react-icons/fa";
import { IoMdHeart, IoIosHeartEmpty } from "react-icons/io";

import moment from "moment";
import { Comment, PublicUser } from "@prisma/client";
import { useRecoilValue } from "recoil";
import { sessionAndPublicUserState } from "@/atoms/sessionAndUserAtom";
import { SessionAndPublicUserStateType } from "@/types/atoms/SessionAndPublicUserStateType";

export type CommentWith = Comment & {
  publicUsers: PublicUser;
  voteStatus?: number;
};

type CommentItemProps = {
  comment: CommentWith;
  onDeleteComment: (comment: Comment) => void;
  onVoteComment: (event: React.MouseEvent<Element, MouseEvent>, comment: Comment, sessionAndPublicUser: SessionAndPublicUserStateType | null) => void;
  isLoading: boolean;
  userId?: string;
  isAlreadyVoted?: number;
  isSessionUserCreator?: boolean;
  sessionAndPublicUserState: SessionAndPublicUserStateType;
};

const CommentItem: FC<CommentItemProps> = ({ comment, onDeleteComment, onVoteComment, isLoading, isAlreadyVoted, isSessionUserCreator }) => {
  const _sessionAndPublicUserState = useRecoilValue(sessionAndPublicUserState);

  return (
    <div className="flex">
      <div className="mr-2">
        <FaReddit className="text-gray-300 text-3xl" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-bold hover:underline hover:cursor-pointer">
            {comment.publicUsers.nickName}
          </span>
          {comment.createdAt && (
            <span className="text-gray-600">
              {moment(new Date(comment.createdAt)).fromNow()}
            </span>
          )}
          {isLoading && <div className="spinner-border text-secondary" role="status" />}
        </div>
        <span className="text-sm">{comment.text}</span>
        <div className="flex items-center cursor-pointer font-semibold text-muted-foreground space-x-4">
          {comment.voteStatus !== 1 ? (
            <IoIosHeartEmpty className="h-4 w-4" onClick={(event) => onVoteComment(event, comment, _sessionAndPublicUserState)} />
          ) : (
            <IoMdHeart className="h-4 w-4" onClick={(event) => onVoteComment(event, comment, _sessionAndPublicUserState)} />
          )}
          <span className="font-cpmo text-xs text-primary">
            {comment.voteStatus || 0}
          </span>
          {isSessionUserCreator && (
            <span className="text-xs hover:text-blue-500 font-cpmo uppercase" onClick={() => onDeleteComment(comment)}>
              Delete
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
import { FC } from "react";
import { FaReddit } from "react-icons/fa";
import { IoMdHeart, IoIosHeartEmpty } from "react-icons/io";

import moment from "moment";
import { Comment } from "@prisma/client";
import { useRecoilValue } from "recoil";
import { globalAuthState } from "@/atoms/globalAuthStateAtom";
import { Session } from "@supabase/supabase-js";
import { CommentWith } from "@/types/comment/CommentList";

type CommentItemProps = {
  comment: CommentWith;
  commentIdx?: number;
  globalSessionData: Session | null;
  onVoteComment: (event: React.MouseEvent<Element, MouseEvent>, comment: Comment, globalSessionData: Session | null) => void;
  onDeleteComment: (comment: Comment) => void;
  isAlreadyVoted?: boolean;
  isUserCreator?: boolean;
};

const CommentItem: FC<CommentItemProps> = ({ 
  comment, 
  commentIdx,
  globalSessionData,
  onVoteComment, 
  onDeleteComment, 
  isAlreadyVoted, 
  isUserCreator,
}) => {
  console.log("comment", comment);

  return (
    <div className="flex">
      <div className="mr-2">
        <FaReddit className="text-gray-300 text-3xl" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-bold font-scor hover:underline hover:cursor-pointer">
            {comment.publicUsers.nickName}
          </span>
          {comment.createdAt && (
            <span className="text-muted-foreground font-cpmo uppercase">
              {moment(new Date(comment.createdAt)).fromNow()}
            </span>
          )}
        </div>
        <span className="text-sm">{comment.text}</span>
        <div className="flex items-center cursor-pointer font-semibold text-muted-foreground space-x-4">
          {isAlreadyVoted !== true ? (
            <IoIosHeartEmpty className="h-4 w-4" onClick={(event) => onVoteComment(event, comment, globalSessionData)} />
          ) : (
            <IoMdHeart className="h-4 w-4" onClick={(event) => onVoteComment(event, comment, globalSessionData)} />
          )}
          <span className="font-cpmo text-xs text-primary">
            {comment.voteStatus || 0}
          </span>
          {isUserCreator && (
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
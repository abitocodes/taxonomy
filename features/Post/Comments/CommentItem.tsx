import { FC } from "react";
import { FaReddit } from "react-icons/fa";
import { TbArrowBigDown, TbArrowBigUp } from "react-icons/tb";

import moment from "moment";
import { Comment, PublicUser } from "@prisma/client";

export type CommentWith = Comment & {
  creator: public_users;
};

type CommentItemProps = {
  comment: CommentWith;
  onDeleteComment: (comment: Comment) => void;
  isLoading: boolean;
  userId?: string;
};

const CommentItem: FC<CommentItemProps> = ({ comment, onDeleteComment, isLoading, userId }) => {
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
        <div className="flex items-center cursor-pointer font-semibold text-gray-500">
          <TbArrowBigUp />
          <TbArrowBigDown />
          {userId === comment.creatorId && (
            <>
              <span className="text-xs hover:text-blue-500">
                Edit
              </span>
              <span className="text-xs hover:text-blue-500" onClick={() => onDeleteComment(comment)}>
                Delete
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default CommentItem;
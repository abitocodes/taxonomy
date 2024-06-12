import React from 'react';
import { CommentWith } from "@/types/comment/CommentList";
import CommentItem from '@/components/Comment/CommentItem';
import { CommentVote } from '@prisma/client';
import { Session } from '@supabase/supabase-js';
import { Comment } from '@prisma/client';

interface CommentListProps {
  commentList: CommentWith[];
  commentVotes: CommentVote[];
  onVoteComment: (event: React.MouseEvent<Element, MouseEvent>, comment: Comment, globalSessionData: Session | null) => void;
  onDeleteComment: (id: string) => void;
  globalSessionData: Session | null;
}

const CommentList: React.FC<CommentListProps> = ({
  commentList,
  commentVotes,
  onDeleteComment,
  onVoteComment,
  globalSessionData
}) => {
  return (
    <>
      {commentList.map((comment, index) => (
        <CommentItem
            key={comment.id}
            comment={comment}
            commentIdx={index}
            globalSessionData={globalSessionData}
            onVoteComment={onVoteComment}
            onDeleteComment={() => onDeleteComment(comment.id)}
        />
      ))}
    </>
  );
};

export default CommentList;
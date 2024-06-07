import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Post } from "@prisma/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PostWith } from "@/types/posts";
import { TbArrowBigDown, TbArrowBigDownFilled, TbArrowBigUp, TbArrowBigUpFilled } from "react-icons/tb";
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { getBadgeVariantFromLabel } from "@/utils/getBadgeVariantFromLabel";
import { Badge } from "@/components/ui/badge";
import { IoMdHeart, IoIosHeartEmpty } from "react-icons/io";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shad/new-york/ui/avatar"
import { Button } from './ui/button';
import { ChatBubbleIcon } from '@radix-ui/react-icons';

interface LinkableCardProps {
  post: PostWith;
  postIdx?: number;
  onVote: (event: React.MouseEvent<Element, MouseEvent>, post: Post, vote: number, channelId: string, postIdx?: number) => void;
  onSelectPost?: (value: Post, postIdx: number) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  router?: AppRouterInstance;
  userVoteValue?: number;
  userIsCreator?: boolean;
  homePage?: boolean;
  cursorPointer?: boolean; // 추가된 prop
}

export function LinkableCard({
  post,
  postIdx,
  onVote,
  onSelectPost,
  onDeletePost,
  router,
  userVoteValue,
  userIsCreator,
  homePage,
  cursorPointer = true, // 기본값은 true로 설정
  ...props
}: LinkableCardProps) {
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const singlePostView = !onSelectPost;

  const handleDelete = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);
      if (!success) throw new Error("Failed to delete post");
      if (router) router.back();
    } catch (error: any) {
      setLoadingDelete(false);
    }
  };

  const containerClasses = `flex w-full flex-col items-center border-b border-dashed bg-background/80 rounded-xl text-card-foreground shadow-md transition-colors hover:bg-muted/50 p-6 pr-8 ${cursorPointer ? 'cursor-pointer' : ''}`;

  return (
    <div className={containerClasses}>
      <div
      className="w-full h-full flex flex-row gap-2"
      onClick={() => {
        if(cursorPointer) {
          onSelectPost && post && onSelectPost(post, postIdx!)}
        }
      }
        >
        <div className="flex w-full flex-col gap-2">
          <div
              className="flex items-center gap-2 text-ctext-xs text-foreground"
            >
            <Avatar className="w-6 h-6">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          <div className="flex item-center h-1/2 text-xs text-center font-cpmo uppercase text-primary">
            @{post.publicUsers.nickName} posted {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
          </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-2">
            <div className="font-semibold text-left text-2xl">{post.title} </div>
          </div>
          </div>
          {post.labels.length ? (
          <div className="flex items-center gap-2 text-xs">
            <div>
            <Badge>
            s/{post.channel.name}
              </Badge>
            </div>
            {post.labels.map((label) => (
              <Badge key={label.id} variant={getBadgeVariantFromLabel(label.name)}>
                {label.name}
              </Badge>
            ))}
          </div>
        ) : null}

          <div className="w-11/12 line-clamp-2 tracking-wider leading-loose text-left text-xs text-muted-foreground mt-4">
          {post.description.substring(0, 300)}
        </div>

        </div>
        <div className={`flex flex-col items-center space-y-4 bg-${singlePostView ? "transparent" : "gray-100"} w-10 ${singlePostView ? "" : "rounded-l-md"}`}>
          <div className="flex flex-col items-center">
          {userVoteValue === 1 ? (
            <Button 
              variant="ghost"
              size="icon"
              onClick={(event) => onVote(event, post, 1, post.channelId)}>
            <IoIosHeartEmpty className="h-4 w-4 "/>
            </Button>
          ) : (
            <Button 
              variant="ghost"
              size="icon"
              onClick={(event) => onVote(event, post, -1, post.channelId)}>
            <IoMdHeart className="h-4 w-4"/>
          </Button>
          )}
            <span className="font-cpmo text-xs text-primary">
              {post.voteStatus || 0}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Button 
              variant="ghost"
              size="icon"
              onClick={(event) => onVote(event, post, 1, post.channelId)}>
              <ChatBubbleIcon className="h-3 w-3"/>
            </Button>
            <span className="font-cpmo text-xs text-primary">
              {post.numberOfComments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Post } from "@prisma/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { postsWith } from "@/types/posts";
import { TbArrowBigDown, TbArrowBigDownFilled, TbArrowBigUp, TbArrowBigUpFilled } from "react-icons/tb";
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { getBadgeVariantFromLabel } from "@/utils/getBadgeVariantFromLabel";
import { Badge } from "@/components/ui/badge";


interface LinkedCardProps {
  post: postsWith;
  postIdx?: number;
  onVote: (event: React.MouseEvent<SVGElement, MouseEvent>, post: Post, vote: number, genreId: string, postIdx?: number) => void;
  onSelectPost?: (value: Post, postIdx: number) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  router?: AppRouterInstance;
  userVoteValue?: number;
  userIsCreator?: boolean;
  homePage?: boolean;
}

export function LinkedCard({ post, postIdx, onVote, onSelectPost, onDeletePost, router, userVoteValue, userIsCreator, homePage, ...props }: LinkedCardProps) {
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
  return (
    <div
      className=
        "flex w-1/2 flex-col items-center rounded-xl border bg-card text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-4">
      <button
      className="w-full h-full flex flex-row gap-2"
      onClick={() => {
        console.log("clicked")
        onSelectPost && post && onSelectPost(post, postIdx!)}
      }
        >

        <div className={`flex flex-col space-y-4 items-center bg-${singlePostView ? "transparent" : "gray-100"} p-2 w-10 ${singlePostView ? "" : "rounded-l-md"}`}>
          <TbArrowBigUp className={`text-${userVoteValue === 1 ? "primary" : "muted"} text-xl cursor-pointer`}
                        onClick={(event) => onVote(event, post, 1, post.genreId)} />
          <span className="text-sm font-bold">
            {post.voteStatus}
          </span>
          <TbArrowBigDown className={`text-${userVoteValue === -1 ? "secondary" : "muted"} text-xl cursor-pointer`}
                          onClick={(event) => onVote(event, post, -1, post.genreId)} />
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
            <div className="font-semibold text-left">[ {post.numberOfComments} ] {post.title} </div>
            </div>
            <div
              className="ml-auto text-xs text-foreground"
            >
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>
          <div className="text-xs text-left font-medium">{post.publicUsers.nickName}</div>
          <div className="line-clamp-2 text-left text-xs text-muted-foreground">
          {post.description.substring(0, 300)}
        </div>
        {post.labels.length ? (
          <div className="flex items-center gap-2">
            {post.labels.map((label) => (
              <Badge key={label.id} variant={getBadgeVariantFromLabel(label.name)}>
                {label.name}
              </Badge>
            ))}
          </div>
        ) : null}
        </div>

      </button>
    </div>
  );
}
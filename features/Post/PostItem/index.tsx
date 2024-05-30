import { FC, useState } from "react";

import { cn } from "@/lib/utils";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { IoArrowRedoOutline, IoBookmarkOutline } from "react-icons/io5";
import { TbArrowBigDown, TbArrowBigDownFilled, TbArrowBigUp, TbArrowBigUpFilled } from "react-icons/tb";
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { getBadgeVariantFromLabel } from "@/utils/getBadgeVariantFromLabel";

import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { Badge } from "@/components/ui/badge";

import { Post, Label, PublicUser } from "@prisma/client";
import { PostWith } from "@/types/Post";
import { Container } from "@radix-ui/themes";
import { CardContent } from "@/components/ui/card";

type PostItemContentProps = {
  post: PostWith;
  onVote: (event: React.MouseEvent<SVGElement, MouseEvent>, post: Post, vote: number, communityId: string, postIdx?: number) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  userIsCreator: boolean;
  onSelectPost?: (value: Post, postIdx: number) => void;
  router?: AppRouterInstance;
  postIdx?: number;
  userVoteValue?: number;
  homePage?: boolean;
};

const PostItem: FC<PostItemContentProps> = ({ post, postIdx, onVote, onSelectPost, router, onDeletePost, userVoteValue, userIsCreator, homePage }) => {
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
      <button
      className="flex flex-row gap-2"
      onClick={() => {
        console.log("clicked")
        onSelectPost && post && onSelectPost(post, postIdx!)}
      }
        >
      <CardContent>
        <div className={`flex flex-col items-center bg-${singlePostView ? "transparent" : "gray-100"} p-2 w-10 ${singlePostView ? "" : "rounded-l-md"}`}>
          <TbArrowBigUp className={`text-${userVoteValue === 1 ? "primary" : "muted"} text-xl cursor-pointer`}
                        onClick={(event) => onVote(event, post, 1, post.communityId)} />
          <span className="text-sm font-bold">
            {post.voteStatus}
          </span>
          <TbArrowBigDown className={`text-${userVoteValue === -1 ? "secondary" : "muted"} text-xl cursor-pointer`}
                          onClick={(event) => onVote(event, post, -1, post.communityId)} />
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{post.title} {[post.numberOfComments]}</div>
            </div>
            <div
              className="ml-auto text-xs text-foreground"
            >
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>
          <div className="text-xs font-medium">{post.creator.nickName}</div>
          <div className="line-clamp-2 text-xs text-muted-foreground">
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
        </CardContent>
      </button>

  );
}

export default PostItem;
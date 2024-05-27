import { FC, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { IoArrowRedoOutline, IoBookmarkOutline } from "react-icons/io5";
import { TbArrowBigDown, TbArrowBigDownFilled, TbArrowBigUp, TbArrowBigUpFilled } from "react-icons/tb";

import moment from "moment";
import Link from "next/link";
import { NextRouter } from "next/router";

import { Post } from "@/types/PostState";

type PostItemContentProps = {
  post: Post;
  onVote: (event: React.MouseEvent<SVGElement, MouseEvent>, post: Post, vote: number, communityId: string, postIdx?: number) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  userIsCreator: boolean;
  onSelectPost?: (value: Post, postIdx: number) => void;
  router?: NextRouter;
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
    <div className={`flex border ${singlePostView ? "border-white" : "border-gray-300"} bg-white rounded ${singlePostView ? "rounded-t-none" : "rounded-md"} cursor-pointer hover:border-gray-500`}
         onClick={() => onSelectPost && post && onSelectPost(post, postIdx!)}>
      <div className={`flex flex-col items-center bg-${singlePostView ? "transparent" : "gray-100"} p-2 w-10 ${singlePostView ? "" : "rounded-l-md"}`}>
        <TbArrowBigUp className={`text-${userVoteValue === 1 ? "brand-100" : "gray-400"} text-xl cursor-pointer`}
                      onClick={(event) => onVote(event, post, 1, post.communityId)} />
        <span className="text-sm font-bold">
          {post.voteStatus}
        </span>
        <TbArrowBigDown className={`text-${userVoteValue === -1 ? "blue-500" : "gray-400"} text-xl cursor-pointer`}
                        onClick={(event) => onVote(event, post, -1, post.communityId)} />
      </div>
      <div className="flex flex-col flex-grow">
        <div className="space-y-1 p-2.5">
          {post.createdAt && (
            <div className="flex items-center space-x-1.5 text-sm">
              {homePage && (
                <>
                  {post.communityImageURL ? (
                    <img className="rounded-full w-4.5 h-4.5 mr-2" src={post.communityImageURL} alt="community image" />
                  ) : (
                    <FaReddit className="text-blue-500 text-xl mr-1" />
                  )}
                  <Link href={`r/${post.communityId}`}>
                    <span className="font-bold hover:underline" onClick={(event) => event.stopPropagation()}>{`r/${post.communityId}`}</span>
                  </Link>
                  <BsDot className="text-gray-500 text-xs" />
                </>
              )}
              <span className="text-gray-500">
                Posted by u/{post.authorDisplayText} {moment(post.createdAt).fromNow()}
              </span>
            </div>
          )}
          <span className="text-lg font-bold">
            {post.title}
          </span>


          <span className="text-sm">
              {post.body}
            </span>
            {post.link && (
              <div className="flex justify-center items-center p-2">
                {/* Microlink integration for link previews */}
              </div>
            )}
            {post.mediaURL && (
              <div className="flex justify-center items-center p-2">
                {post.mediaType === "video" ? (
                  <video controls src={post.mediaURL} className="max-h-96 w-full object-contain" />
                ) : (
                  <>
                    {loadingImage && <div className="h-52 w-full bg-gray-200 animate-pulse rounded-md"></div>}
                    <img className={`max-h-96 w-full object-cover ${loadingImage ? "hidden" : "block"}`} src={post.mediaURL} onLoad={() => setLoadingImage(false)} alt="Post Image" />
                  </>
                )}
              </div>
            )}
          </div>
          <div className="ml-1 mb-1 text-gray-500 font-bold flex">
            <div className="flex items-center p-2 rounded-md hover:bg-gray-200 cursor-pointer">
              <BsChat className="mr-2" />
              <span className="text-sm">{post.numberOfComments}</span>
            </div>
            <div className="flex items-center p-2 rounded-md hover:bg-gray-200 cursor-pointer">
              <IoArrowRedoOutline className="mr-2" />
              <span className="text-sm">Share</span>
            </div>
            <div className="flex items-center p-2 rounded-md hover:bg-gray-200 cursor-pointer">
              <IoBookmarkOutline className="mr-2" />
              <span className="text-sm">Save</span>
            </div>
            {userIsCreator && (
              <div className="flex items-center p-2 rounded-md hover:bg-gray-200 cursor-pointer" onClick={handleDelete}>
                {loadingDelete ? (
                  <svg className="animate-spin h-5 w-5 border-t-2 border-blue-500 rounded-full" viewBox="0 0 24 24"></svg>
                ) : (
                  <>
                    <AiOutlineDelete className="mr-2" />
                    <span className="text-sm">Delete</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default PostItem;
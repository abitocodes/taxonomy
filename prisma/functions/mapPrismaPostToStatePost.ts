import { Post, PostVote } from "@prisma/client";
import { getAuthorDisplayText } from "@/prisma/functions/getAuthorDisplayText";

export async function mapPrismaPostToStatePost(prismaPost: Post): Promise<Post> {
  return {
    id: prismaPost.id,
    title: prismaPost.title,
    body: prismaPost.body || 'No Content',  // 선택적 필드, 기본값 'No Content'
    createdAt: prismaPost.createdAt,
    editedAt: prismaPost.editedAt,
    genreId: prismaPost.genreId || "defaultGenreId",
    nickName: prismaPost.displayName || "defaultnickName",
    creatorId: prismaPost.creatorId,
    voteStatus: prismaPost.voteStatus,
    link: prismaPost.link || '',  // 선택적 필드, 기본값 ''
    numberOfComments: prismaPost.numberOfComments || 0,
    postIdx: prismaPost.postIdx || 0,
  };
}


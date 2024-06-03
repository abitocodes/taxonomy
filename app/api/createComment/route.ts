import { prisma } from "@/prisma/client";
import { generateHashId } from "@/utils/generateHashId";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const genreId = url.searchParams.get('genreId');
  const postId = url.searchParams.get('postId');
  const creatorId = url.searchParams.get('creatorId');
  const text = url.searchParams.get('text');

  try {
    const createdComment = await prisma.comment.create({
      data: {
        id: generateHashId(),
        postId: postId || "",
        creatorId: creatorId || "",
        text: text || "",
        genreId: genreId || "",
        createdAt: new Date(),
      },
      include: {
        publicUsers: true // 사용자 정보를 포함하여 댓글 생성
      }
    });

    // 댓글이 성공적으로 생성된 후, 관련 게시물의 댓글 수를 업데이트
    const updatedPost = await prisma.post.update({
      where: { id: postId! },
      data: { numberOfComments: { increment: 1 } }
    });

    return Response.json({
      statusCode: 200,
      message: '200 OK',
      comment: {
        ...createdComment,
      },
      updatedPost: updatedPost
    });
  } catch (error) {
    console.error('Failed to create comment', error);
    return Response.json({
      statusCode: 500,
      message: 'Failed to create comment'
    });
  }
}
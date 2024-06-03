import { prisma } from "@/prisma/client";

export async function GET(request: Request) {
    const url = new URL(request.url)
    const commentId = url.searchParams.get('commentId')
    const postId = url.searchParams.get('postId')

    try {
      await prisma.comment.delete({
        where: { id: commentId as string }
      });

      const updatedPost = await prisma.post.update({
        where: { id: postId as string },
        data: { numberOfComments: { decrement: 1 } }
      });

      return Response.json({
        statusCode: 200,
        message: '200 OK',
        numberOfComments: updatedPost.numberOfComments,
    }); 
    } catch (error) {
        return Response.json({
            statusCode: 500,
            message: 'error.message'
        });
  } 
}
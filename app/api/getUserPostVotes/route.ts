import { prisma } from "@/prisma/client";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const postIdsParam = url.searchParams.get('postIds');
    const postIds = postIdsParam ? postIdsParam.split(',') : [];

    const postVotes = await prisma.postVote.findMany({
      where: {
        postId: { in: postIds }
      }
    });
    return Response.json({
      statusCode: 200,
      message: '200 OK',
      postVotes: postVotes,
    });
  } catch (error) {
    return Response.json({
      statusCode: 500,
      message: 'An error occurred while retrieving posts'
    });
  }
}
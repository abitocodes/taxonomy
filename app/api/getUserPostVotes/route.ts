import { prisma } from "@/prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  console.log("app/api/getUserPostVotes/route.ts searchParams", searchParams);
  const postIds = searchParams.get('postIds')?.split(',') || [];
  console.log("app/api/getUserPostVotes/route.ts postIds", postIds);

  try {
    const postVotes = await prisma.postVote.findMany({
      where: {
        postId: { in: postIds }
      }
    });
    console.log("app/api/getUserPostVotes/route.ts getUserPostVotes", postVotes);
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
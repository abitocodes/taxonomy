import { prisma } from "@/prisma/client";
import { getPostList } from "@/utils/getPostList";

export async function GET(request: Request) {
  console.log("getHomePostListWithSession API Called")
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(JSON.stringify({
          statusCode: 400,
          message: 'User ID is required.'
      }), { status: 400 });
    }

    const { postList, postVotes } = await getPostList(userId);

    return new Response(JSON.stringify({
      statusCode: 200,
      message: '200 OK',
      postList: postList,
      postVotes: postVotes
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({
      statusCode: 500,
      message: 'An error occurred while retrieving postList'
    }), { status: 500 });
  }
}
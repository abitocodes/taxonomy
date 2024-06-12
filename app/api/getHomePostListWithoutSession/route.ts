import { prisma } from "@/prisma/client";

import { getPostList } from "@/utils/getPostList";

export async function GET(req: Request, res: Response) {
  console.log("getHomePostListWithoutSession API Called")
  try {
    const { postList } = await getPostList();

    return Response.json({
      statusCode: 200,
      message: '200 OK',
      postList: postList,
    });
  } catch (error) {
    return Response.json({
      statusCode: 500,
      message: 'An error occurred while retrieving postList'
    });
  }
}
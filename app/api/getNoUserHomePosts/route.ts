import { prisma } from "@/prisma/client";

export async function GET(req: Request, res: Response) {
  console.log("app/api/getNoUserHomePosts/route.ts req.body", req.body);
  try {
    const posts = await prisma.post.findMany({
      orderBy: { voteStatus: 'desc' },
      take: 10
    });
    console.log("app/api/getNoUserHomePosts/route.ts getNoUserHomePosts", posts);
    return Response.json({
      statusCode: 200,
      message: '200 OK',
      posts: posts,
  });
  } catch (error) {
    return Response.json({
      statusCode: 500,
      message: 'An error occurred while retrieving posts'
  });
  }
}
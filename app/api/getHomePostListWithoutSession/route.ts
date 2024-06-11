import { prisma } from "@/prisma/client";

export async function GET(req: Request, res: Response) {
  try {
    const postList = await prisma.post.findMany({
      orderBy: { voteStatus: 'desc' },
      include: {
        channel: true,
        labels: true,
        publicUsers: {
          select: {
            nickName: true
          }
        }
      },
      take: 10
    });
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
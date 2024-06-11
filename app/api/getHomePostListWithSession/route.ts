import { prisma } from "@/prisma/client";

export async function GET(request: Request) {
  console.log("getHomePostListWithSession API 실행")
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    const userChannels = await prisma.channelSnippet.findMany({
      where: { userId: userId },
      select: {
        channels: {
          select: {
            id: true
          }
        }
      }
    });

    if (!userChannels) {
      return Response.json({
          statusCode: 400,
          message: 'User or channels not found.'
      });
    }

    const channelIds = userChannels.flatMap(userChannel => 
      Array.isArray(userChannel.channels) ? userChannel.channels.map(channel => channel.id) : [userChannel.channels.id]
    );

    // 해당 장르에 속하는 게시물 검색
    const postList = await prisma.post.findMany({
      where: {
        channelId: { in: channelIds },
      },
      orderBy: { createdAt: 'desc' },
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

    const sortedPostList = postList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return Response.json({
      statusCode: 200,
      message: '200 OK',
      postList: sortedPostList,
    });
  } catch (error) {
    return Response.json({
      statusCode: 500,
      message: 'An error occurred while retrieving postList'
    });
  }
}
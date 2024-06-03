import { prisma } from '@/prisma/client';

export async function GET(request: Request) {
    const url = new URL(request.url)
    const channelId = url.searchParams.get('channelId')
    const userId = url.searchParams.get('userId')

  if (!channelId || !userId) {
    return Response.json({
        statusCode: 400,
        message: 'Channel ID and User ID are required'
    })
  }

  try {
    const postVotes = await prisma.postVote.findMany({
      where: {
        channelId: channelId as string,
        userId: userId as string
      }
    });
    return Response.json({
        statusCode: 200,
        message: '200 OK',
        postVotes: postVotes,
  }); 
}
  catch (error) {
    return Response.json({
      statusCode: 500,
      message: 'An error occurred while retrieving posts'
    });
  }
}


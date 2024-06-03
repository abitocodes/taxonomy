import { prisma } from '@/prisma/client';

export async function GET(request: Request) {
    const url = new URL(request.url)
    const genreId = url.searchParams.get('genreId')
    const userId = url.searchParams.get('userId')

  if (!genreId || !userId) {
    return Response.json({
        statusCode: 400,
        message: 'Genre ID and User ID are required'
    })
  }

  try {
    const postVotes = await prisma.postVote.findMany({
      where: {
        genreId: genreId as string,
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


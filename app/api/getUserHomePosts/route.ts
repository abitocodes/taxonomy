import { prisma } from "@/prisma/client";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('id');
    console.log("getUserHomePosts, Param userId: ", userId)

    const userGenres = await prisma.genreSnippet.findMany({
      where: { userId: userId },
      select: {
        genres: {
          select: {
            id: true
          }
        }
      }
    });

    console.log("getUserHomePosts, userGenres of userId: ", userGenres)

    if (!userGenres) {
      return Response.json({
          statusCode: 400,
          message: 'User or genres not found.'
      });
  }

    const genreIds = userGenres.flatMap(userGenre => 
      Array.isArray(userGenre.genres) ? userGenre.genres.map(genre => genre.id) : [userGenre.genres.id]
    );

    // 해당 장르에 속하는 게시물 검색
    const posts = await prisma.post.findMany({
      where: {
        genreId: { in: genreIds },
      },
      orderBy: { voteStatus: 'desc' },
      include: {
        genre: true,
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
      posts: posts,
    });
  } catch (error) {
    return Response.json({
      statusCode: 500,
      message: 'An error occurred while retrieving posts'
    });
  }
}
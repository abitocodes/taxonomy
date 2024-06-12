import { prisma } from "@/prisma/client";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    if (!userId) {
        return Response.json({
            statusCode: 400,
            message: 'Post ID is required'
        });
    }

    try {
        const posts = await prisma.post.findMany({
            where: {
                creatorId: userId as string,
            },
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
            posts: posts
        });
    } catch (error) {
        console.error("getPostCommentList error", error.message);
        return Response.json({
            statusCode: 500,
            message: 'Failed to fetch getUserPosts'
        })
    }
}
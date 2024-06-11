import { prisma } from "@/prisma/client";

export async function GET(request: Request) {
    console.log("getPostCommentList request", request);
    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');
    if (!postId) {
        return Response.json({
            statusCode: 400,
            message: 'Post ID is required'
        });
    }

    try {
        const comments = await prisma.comment.findMany({
            where: {
                postId: postId as string,
            },
            include: {
                publicUsers: {
                    select: {
                        nickName: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return Response.json({
            statusCode: 200,
            message: '200 OK',
            commentList: comments
        });
    } catch (error) {
        console.error("getPostComments error", error.message);
        return Response.json({
            statusCode: 500,
            message: 'Failed to fetch comments'
        })
    }
}
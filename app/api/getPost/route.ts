import { prisma } from "@/prisma/client";

interface ResponseData {
    statusCode: number;
    message: string;
    post: any; // 'any' 대신 더 구체적인 타입을 사용할 수 있습니다.
    isAlreadyVoted?: boolean;
    isUserCreator?: boolean;
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const pid = url.searchParams.get('postId');
    const userId = url.searchParams.get('userId'); // 사용자 ID를 선택적으로 가져옵니다.

    if (!pid) {
        return Response.json({
            statusCode: 400,
            message: 'Post ID is required'
        });
    }

    try {
        const postData = await prisma.post.findUnique({
            where: {
                id: pid as string,
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
        });

        if (!postData) {
            return Response.json({
                statusCode: 404,
                message: '"Post not found"',
            });
        }

        let response: ResponseData = {
            statusCode: 200,
            message: '200 OK',
            post: postData
        };

        if (userId) {
            // 투표 여부를 확인합니다.
            const postVote = await prisma.postVote.findFirst({
                where: {
                    postId: pid,
                    userId: userId
                }
            });

            // 게시글 작성자 여부를 확인합니다.
            const isUserCreator = postData.creatorId === userId;

            response.isAlreadyVoted = postVote !== null;
            response.isUserCreator = isUserCreator;
        }

        return Response.json(response);

    } catch (error) {
        return Response.json({
            statusCode: 500,
            message: '게시물을 검색하는 동안 오류가 발생했습니다.'
        });
    }
}
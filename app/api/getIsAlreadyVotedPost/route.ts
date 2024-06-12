import { prisma } from '@/prisma/client';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const postId = url.searchParams.get('postId');
    const userId = url.searchParams.get('userId');

    if (!postId || !userId) {
        return new Response(JSON.stringify({
            statusCode: 400,
            message: 'Post ID and User ID are required'
        }), { status: 400 });
    }

    try {
        const postVote = await prisma.postVote.findFirst({
            where: {
                postId: postId,
                userId: userId
            }
        });

        return new Response(JSON.stringify({
            statusCode: 200,
            message: '200 OK',
            isAlreadyVoted: postVote !== null
        }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({
            statusCode: 500,
            message: '투표 정보를 검색하는 동안 오류가 발생했습니다.'
        }), { status: 500 });
    }
}
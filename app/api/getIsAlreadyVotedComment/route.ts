import { prisma } from '@/prisma/client';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const commentId = url.searchParams.get('commentId');
    const userId = url.searchParams.get('userId');

    if (!commentId || !userId) {
        return new Response(JSON.stringify({
            statusCode: 400,
            message: '댓글 ID와 사용자 ID는 필수입니다.'
        }), { status: 400 });
    }

    try {
        const commentVote = await prisma.commentVote.findFirst({
            where: {
                commentId: commentId,
                userId: userId
            }
        });

        return new Response(JSON.stringify({
            statusCode: 200,
            message: '200 OK',
            isAlreadyVoted: commentVote !== null
        }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({
            statusCode: 500,
            message: '투표 정보를 검색하는 동안 오류가 발생했습니다.'
        }), { status: 500 });
    }
}
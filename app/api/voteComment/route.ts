import { prisma } from '@/prisma/client';
import { generateVoteHashId } from '@/utils/generateHashId';

export async function GET(request: Request) {
    console.log("Vote Comment API Called, url: ", request.url)
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')!
    const commentId = url.searchParams.get('commentId')!
    console.log("userId: ", userId)
    console.log("commentId: ", commentId)

    try {
        const isAlreadyVoted = await prisma.commentVote.findFirst({
            where: {
                commentId: commentId,
                userId: userId
            }
        });

        let voteResult;

        if (!isAlreadyVoted) {
            const createdAt = new Date();
            voteResult = await prisma.commentVote.create({
                data: {
                    id: generateVoteHashId(createdAt, userId, commentId),
                    commentId: commentId,
                    userId: userId,
                    voteValue: 1,
                    createdAt: createdAt
                }
            });
            // 새로운 투표가 추가되면 Comment의 voteStatus 업데이트
            const comment = await prisma.comment.findUnique({
                where: { id: commentId }
            });
            if (comment && comment.voteStatus === null) {
                await prisma.comment.update({
                    where: { id: commentId },
                    data: { voteStatus: 1 }
                });
            } else {
                await prisma.comment.update({
                    where: { id: commentId },
                    data: { voteStatus: { increment: 1 } }
                });
            }
        } else {
            // 기존 투표 삭제
            await prisma.commentVote.delete({
                where: {
                    id: isAlreadyVoted.id
                }
            });
            voteResult = null;
            // 투표가 삭제되면 Comment의 voteStatus 업데이트
            await prisma.comment.update({
                where: { id: commentId },
                data: { voteStatus: { decrement: isAlreadyVoted.voteValue } }
            });
        }

        return Response.json({
            statusCode: 200,
            message: '200 OK, Vote Processed',
            voteResult: voteResult,
            isAlreadyVoted: isAlreadyVoted
        });
    } catch (error) {
        return Response.json({
            statusCode: 500,
            message: 'Error while voting'
        });
    }
}
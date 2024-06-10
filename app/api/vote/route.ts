import { prisma } from '@/prisma/client';
import { generateHashId } from '@/utils/generateHashId';

export async function GET(request: Request) {
    console.log("Vote API Called, url: ", request.url)
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')!
    const postId = url.searchParams.get('postId')!
    console.log("userId: ", userId)
    console.log("postId: ", postId)
  
    try {
        const isAlreadyVoted = await prisma.postVote.findFirst({
            where: {
                postId: postId,
                userId: userId
            }
        });
  
        let voteResult;
  
        if (!isAlreadyVoted) {
            voteResult = await prisma.postVote.create({
                data: {
                    id: generateHashId(),
                    postId: postId,
                    userId: userId,
                    voteValue: 1
                }
            });
            // 새로운 투표가 추가되면 Post의 voteStatus 업데이트
            const post = await prisma.post.findUnique({
                where: { id: postId }
            });
            if (post && post.voteStatus === null) {
                await prisma.post.update({
                    where: { id: postId },
                    data: { voteStatus: 1 }
                });
            } else {
                await prisma.post.update({
                    where: { id: postId },
                    data: { voteStatus: { increment: 1 } }
                });
            }
        } else {
            // 기존 투표 삭제
            await prisma.postVote.delete({
                where: {
                    id: isAlreadyVoted.id
                }
            });
            voteResult = null;
            // 투표가 삭제되면 Post의 voteStatus 업데이트
            await prisma.post.update({
                where: { id: postId },
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
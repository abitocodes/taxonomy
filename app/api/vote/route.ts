import { prisma } from '@/prisma/client';
import { generateHashId } from '@/utils/generateHashId';

export async function GET(request: Request) {
    console.log("Vote API Called, url: ", request.url)
    const url = new URL(request.url)
    const channelId = url.searchParams.get('channelId')!
    const userId = url.searchParams.get('userId')!
    const postId = url.searchParams.get('postId')!
    const voteValue = url.searchParams.get('voteValue')!
    const voteValueInt = parseInt(voteValue, 10)
    console.log("channelId: ", channelId)
    console.log("userId: ", userId)
    console.log("postId: ", postId)
    console.log("voteValue: ", voteValue)
    console.log("voteValueInt: ", voteValueInt)

  try {
    const isAlreadyVoted = await prisma.postVote.findFirst({
        where: {
            postId: postId.toString(),
            userId: userId.toString()
        }
    });

    let voteResult;

    if (!isAlreadyVoted) {
      voteResult = await prisma.postVote.create({
        data: {
          id: generateHashId(),
          postId: postId.toString(),
          channelId: channelId.toString(),
          voteValue: voteValueInt,
          userId: userId.toString()
        }
      });
    } else {
      await prisma.postVote.delete({
        where: {
          id: postId.toString()
        }
      });
      // 기존 투표 삭제
      voteResult = null;
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
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma/client';

export async function GET(request: Request) {
    const url = new URL(request.url)
    const channelId = parseInt(url.searchParams.get('channelId')!, 10)
    const userId = parseInt(url.searchParams.get('userId')!, 10)
    const postId = parseInt(url.searchParams.get('postId')!, 10)
    const voteValue = parseInt(url.searchParams.get('voteValue')!, 10)

  try {
    // 투표 상태 업데이트 또는 생성
    const existingVote = await prisma.postVote.findFirst({
        where: {
            postId: postId.toString(),
            userId: userId.toString()
        }
      });

    if (!existingVote) {
      const newVote = await prisma.postVote.create({
        data: {
            postId: postId.toString(),
            channelId: channelId.toString(),
            voteValue: voteValue,
            userId: userId.toString()
        }
      });
      return Response.json({
        statusCode: 200,
        message: '200 OK, Created Vote',
        newVote: newVote
    })
    } else {
      const updatedVote = await prisma.postVote.update({
        where: {
          id: existingVote.id
        },
        data: {
          voteValue: voteValue
        }
      });
      return Response.json({
        statusCode: 200,
        message: '200 OK, Updated Vote',
        updatedVote: updatedVote
    })
    }
  } catch (error) {
    return Response.json({
        statusCode: 500,
        message: 'Error while voting'
      });
  }
}
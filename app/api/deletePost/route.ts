import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma/client';

export async function DELETE(request: Request) {
    const url = new URL(request.url)
    const postId = url.searchParams.get('postId')

  if (!postId) {
    return Response.json({
        statusCode: 400,
        message: 'Post ID is required'
    })
  }

  try {
    await prisma.post.delete({
      where: { id: postId as string }
    });
    return Response.json({
        statusCode: 200,
        message: '200 OK, Post Deleted',
    })
  } catch (error) {
    return Response.json({
        statusCode: 500,
        message: 'Error deleting post'
      });
  }
}
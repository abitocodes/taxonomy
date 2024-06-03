import { prisma } from "@/prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const pid = url.searchParams.get('postId');
    
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

        return Response.json({
            statusCode: 200,
            message: '200 OK',
            post: postData
        });

    } catch (error) {
        return Response.json({
            statusCode: 500,
            message: 'An error occurred while retrieving posts'
        });
    }
}
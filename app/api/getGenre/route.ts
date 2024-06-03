import { prisma } from "@/prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const genreId = url.searchParams.get('genreId');

    try {
        const genreData = await prisma.genre.findUnique({
            where: {
                id: genreId as string,
            },
        });

        if (!genreData) {
            return Response.json({
                statusCode: 404,
                message: '"Genre not found"',
            });
        }

        return Response.json({
            statusCode: 200,
            message: '200 OK',
            genre: genreData
        });

    } catch (error) {
        return Response.json({
            statusCode: 500,
            message: 'An error occurred while retrieving posts'
        });
    }
}
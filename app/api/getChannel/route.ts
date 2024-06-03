import { prisma } from "@/prisma/client";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const channelId = url.searchParams.get('channelId');

    try {
        const channelData = await prisma.channel.findUnique({
            where: {
                id: channelId as string,
            },
        });

        if (!channelData) {
            return Response.json({
                statusCode: 404,
                message: '"Channel not found"',
            });
        }

        return Response.json({
            statusCode: 200,
            message: '200 OK',
            channel: channelData
        });

    } catch (error) {
        return Response.json({
            statusCode: 500,
            message: 'An error occurred while retrieving posts'
        });
    }
}
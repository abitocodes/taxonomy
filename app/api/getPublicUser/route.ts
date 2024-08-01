import { prisma } from "@/prisma/client";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if (!userId) {
            return Response.json({
                statusCode: 400,
                message: 'User ID is required'
            });
        }

        const publicUserData = await prisma.publicUser.findUnique({
            where: {
                id: userId,
            },
        });

        return Response.json({
            statusCode: 200,
            message: '200 OK',
            publicUserData: publicUserData
        });
    } catch (error) {
        return Response.json({
            statusCode: 500,
            message: 'An error occurred while retrieving public user data'
        });
    }
}
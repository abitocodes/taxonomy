import { prisma } from "@/prisma/client";

interface PostVote {
    id: string;
    postId: string;
    voteValue: number;
    userId: string;
    createdAt: Date;
}

export async function getPostList(userId?: string) {
    try {
        let whereClause = {};

        if (userId) {
            const userChannels = await prisma.channelSnippet.findMany({
                where: { userId: userId },
                select: {
                    channels: {
                        select: {
                            id: true
                        }
                    }
                }
            });
            console.log("userChannels", userChannels)
            const channelIds = userChannels.map(uc => uc.channels.id);
            console.log("channelIds", channelIds);

            if (channelIds.length > 0) {
                whereClause = { channelId: { in: channelIds } };
            }
        }

        const postList = await prisma.post.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                channel: true,
                labels: true,
                publicUsers: {
                    select: {
                        nickName: true
                    }
                }
            },
            take: 10
        });

        let postVotes: PostVote[] = [];
        if (userId) {
            const postIds = postList.map(post => post.id);
            postVotes = await prisma.postVote.findMany({
                where: {
                    postId: { in: postIds },
                    userId: userId
                }
            });
        }

        return { postList, postVotes };
    } catch (error) {
        console.error("Error retrieving post list:", error);
        throw error;
    }
}
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
        let isAlreadyVotedList: boolean[] = [];
        let isUserCreatorList: boolean[] = [];

        if (userId) {
            const postIds = postList.map(post => post.id);
            postVotes = await prisma.postVote.findMany({
                where: {
                    postId: { in: postIds },
                    userId: userId
                }
            });

            // postId와 userId가 일치하는 투표 여부 확인
            isAlreadyVotedList = postList.map(post => postVotes.some(vote => vote.postId === post.id));

            // 포스트의 creatorId가 userId와 일치하는지 확인
            isUserCreatorList = postList.map(post => post.creatorId === userId);
        }

        return { postList, postVotes, isAlreadyVotedList, isUserCreatorList };
    } catch (error) {
        console.error("Error retrieving post list:", error);
        throw error;
    }
}
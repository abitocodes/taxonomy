import { createHash } from 'crypto';

export const generateCommentHashId = (createdAt: Date, creatorId: string, postId: string, text: string) => {
    const input = `${createdAt}${creatorId}${postId}${text}`
    const hashId = createHash('sha256').update(input).digest('hex');
    return hashId
};

export const generateVoteHashId = (createdAt: Date, creatorId: string, votedItemId: string) => {
    const input = `${createdAt}${creatorId}${votedItemId}`
    const hashId = createHash('sha256').update(input).digest('hex');
    return hashId
};


import { randomBytes, createHash } from 'crypto';

export const generateHashId = () => {
    const input = randomBytes(16).toString()
    const hashId = createHash('sha256').update(input).digest('hex').substring(0, 8);
    return hashId
};
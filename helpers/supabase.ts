import { prisma } from "@/prisma/client";

export const getMySnippets = async (userId: string) => {
  try {
    const snippets = await prisma.communitySnippet.findMany({
      where: {
        userId: userId
      }
    });
    return snippets;
  } catch (error) {
    throw new Error(error.message);
  }
};
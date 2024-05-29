import { prisma } from "@/prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("app/api/getUserHomePosts/route.ts req.body", req.body);
  const { userId, communityIds } = req.body;
  try {
    const posts = await prisma.post.findMany({
      where: {
        communityId: {
          in: communityIds
        },
        creatorId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    console.log("app/api/getUserHomePosts/route.ts getUserHomePosts", posts);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
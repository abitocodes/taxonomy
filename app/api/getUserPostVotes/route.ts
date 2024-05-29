import { prisma } from "@/prisma/client";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("app/api/getUserPostVotes/route.ts req.body", req.body);
  const { userId, postIds } = req.body;
  try {
    const postVotes = await prisma.postVote.findMany({
      where: {
        postId: { in: postIds },
        userId: userId
      }
    });
    console.log("app/api/getUserPostVotes/route.ts getUserPostVotes", postVotes);
    res.status(200).json(postVotes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
// app/api/getCommunityRecommendations/route.ts
import { prisma } from "@/prisma/client";

import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, res: Response) {
  try {
    console.log("getCommunityRecommendations called.");
    const communities = await prisma.community.findMany({
      orderBy: {
        numberOfMembers: 'desc'
      },
      take: 5
    });
    return Response.json({
        statusCode: 200,
        message: '200 OK',
        communities: communities,
      });
  } catch (error) {
    return Response.json({
        statusCode: 500,
        message: 'An error occurred while retrieving unchecked count'
      });
  }
}
import { prisma } from "@/prisma/client";

export async function getAuthorDisplayText(creatorId: string | undefined): Promise<string> {
    if (!creatorId) {
      return "Unknown";
    }
  
    try {
      const user = await prisma.publicUser.findUnique({
        where: { id: creatorId }
      });
  
      return user?.nickName || "Unknown";
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Unknown";
    }
  }
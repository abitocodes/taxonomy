import { prisma } from "@/prisma/client";

export async function getAuthorDisplayText(creatorId: string | undefined): Promise<string> {
    if (!creatorId) {
      return "Unknown";
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: creatorId }
      });
  
      return user?.name || "Unknown";
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Unknown";
    }
  }
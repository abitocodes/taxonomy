import { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useRecoilState, useSetRecoilState } from "recoil";

import { useRouter, useSearchParams } from "next/navigation";
import { authModalState } from "@/atoms/authModalAtom";
import { communityState, defaultCommunity } from "@/atoms/communitiesAtom";
import { getMySnippets } from "@/helpers/supabase";
import { Community, CommunitySnippet } from "@/types/CommunityState";
import { prisma } from "@/prisma/client";

const useCommunityData = (ssrCommunityData?: boolean) => {
  const { user, loading: authLoading, error: authError } = useAuthState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !!communityStateValue.mySnippets.length) return;

    getSnippets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getSnippets = async () => {
    setLoading(true);
    try {
      if (!user?.id) throw new Error("User ID is undefined");
      const snippets = await getMySnippets(user.id);
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
        initSnippetsFetched: true,
      }));
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  const getCommunityData = async (communityId: string) => {
    try {
      const community = await prisma.community.findUnique({
        where: { id: communityId },
      });
  
      if (!community) throw new Error('Community not found');
  
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: community as Community,
      }));
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  const onJoinLeaveCommunity = (community: Community, isJoined?: boolean) => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setLoading(true);
    if (isJoined) {
      leaveCommunity(community.id);
      return;
    }
    joinCommunity(community);
  };

  const joinCommunity = async (community: Community) => {
    // console.log("JOINING COMMUNITY: ", community.id);
    try {
      // Insert new community snippet for the user
      const newSnippet = await prisma.communitySnippet.create({
        data: {
          userId: user?.id,  // 'uid'를 'id'로 변경
          communityId: community.id,
          imageURL: community.imageURL || "",
        }
      });
  
      // Update the number of members in the community
      const updatedCommunity = await prisma.community.update({
        where: { id: community.id },
        data: {
          numberOfMembers: {
            increment: 1
          }
        }
      });
  
      // Add current community to snippet
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, {
          communityId: community.id,
          imageURL: community.imageURL || "",
        }],
      }));
    } catch (error) {
      // console.log("joinCommunity error", error);
    }
    setLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    try {  
      await prisma.$transaction(async (prisma) => {
        await prisma.communitySnippet.deleteMany({
          where: { communityId: communityId, userId: user?.id },
        });
  
        await prisma.community.update({
          where: { id: communityId },
          data: { numberOfMembers: { decrement: 1 } },
        });
      });
  
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter((item) => item.communityId !== communityId),
      }));
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchParams) {
      const communityId = searchParams.get('community');
      if (communityId) {
        const communityData = communityStateValue.currentCommunity;

        if (!communityData.id) {
          getCommunityData(communityId);
          return;
        }
      } else {
        setCommunityStateValue((prev) => ({
          ...prev,
          currentCommunity: defaultCommunity,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, communityStateValue.currentCommunity]);

  return {
    communityStateValue,
    onJoinLeaveCommunity,
    loading,
    setLoading,
    error,
  };
};

export default useCommunityData;
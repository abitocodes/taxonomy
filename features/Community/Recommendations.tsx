import { FC, useEffect, useState } from "react";
import { FaReddit } from "react-icons/fa";
import Link from "next/link";

import { supabase } from "../../utils/supabase/client";
import useCommunityData from "../../hooks/useCommunityData";
import { Community } from "../../types/CommunityState";
import { prisma } from "@/prisma/client";

type RecommendationsProps = {};

const Recommendations: FC<RecommendationsProps> = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const { communityStateValue, onJoinLeaveCommunity } = useCommunityData(); // Prisma 클라이언트를 임포트합니다.

  const getCommunityRecommendations = async () => {
    try {
      const data = await prisma.community.findMany({
        orderBy: {
          numberOfMembers: 'desc'
        },
        take: 5
      });
  
      const typedData = data.map(community => ({
        ...community,
        privacyType: community.privacyType as "public" | "restricted" | "private",
        imageURL: community.imageURL ?? undefined  // null을 undefined로 변환
      }));
  
      setCommunities(typedData);
    } catch (error) {
      console.error("Error fetching communities", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCommunityRecommendations();
  }, []);

  return (
    <div className="flex flex-col bg-white rounded-md cursor-pointer border border-gray-300">
      <div
        className="flex items-end justify-between text-white p-[6px_10px] bg-blue-500 h-17 rounded-t-md font-semibold"
        style={{ backgroundImage: "url(/images/recCommsArt.png)", backgroundSize: "cover", backgroundBlendMode: "multiply" }}
      >
        Top Communities
      </div>
      <div className="flex flex-col">
        {loading ? (
          <div className="mt-2 p-3 space-y-4">
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="h-2.5 bg-gray-300 rounded w-7/10 animate-pulse"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="h-2.5 bg-gray-300 rounded w-7/10 animate-pulse"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="h-2.5 bg-gray-300 rounded w-7/10 animate-pulse"></div>
            </div>
          </div>
        ) : (
          <>
            {communities.map((item, index) => {
              const isJoined = !!communityStateValue.mySnippets.find((snippet) => snippet.communityId === item.id);
              return (
                <Link key={item.id} href={`/r/${item.id}`}>
                  <div className="flex relative items-center text-sm border-b border-gray-200 p-[10px_12px] font-semibold">
                    <div className="flex items-center w-4/5">
                      <div className="w-1/5">
                        <span className="mr-2">{index + 1}</span>
                      </div>
                      <div className="flex items-center w-4/5">
                        {item.imageURL ? (
                          <img className="rounded-full w-7 h-7 mr-2" src={item.imageURL} alt="community image" />
                        ) : (
                          <FaReddit className="text-[#FF4500] text-7.5 mr-2" />
                        )}
                        <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">{`r/${item.id}`}</span>
                      </div>
                    </div>
                    <div className="absolute right-2.5">
                      <button
                        className={`h-5.5 text-xs ${isJoined ? "border border-blue-500" : "bg-blue-500 text-white"} rounded-md`}
                        onClick={(event) => {
                          event.stopPropagation();
                          onJoinLeaveCommunity(item, isJoined);
                        }}
                      >
                        {isJoined ? "Joined" : "Join"}
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
            <div className="p-[10px_20px]">
              <button className="h-7.5 w-full bg-blue-500 text-white rounded-md">
                View All
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
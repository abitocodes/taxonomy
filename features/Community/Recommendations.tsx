import { FC, useEffect, useState } from "react";
import { FaReddit } from "react-icons/fa";
import Link from "next/link";

import useCommunityData from "@/hooks/useCommunityData";
import { Community } from "@/types/CommunityState";
import { Card, CardHeader, CardContent } from "@/components/shad/new-york/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button";

type RecommendationsProps = {};

const Recommendations: FC<RecommendationsProps> = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const { communityStateValue, onJoinLeaveCommunity } = useCommunityData(); 

  function getCommunityRecommendations() 
  { return fetch('/api/getCommunityRecommendations'); }

  useEffect(() => {
    try {
      getCommunityRecommendations().then(res => res.json()).then(data => { 
        const typedData = data.communities.map((community: Community) => ({
          ...community,
          privacyType: community.privacyType as "public" | "restricted" | "private",
          imageURL: community.imageURL ?? undefined
        }));
        setCommunities(typedData);
        setLoading(false);
      });
    }
    catch (error) {
      console.error("Error fetching communities", error);
    }
  }, []);

  return (
    <Card className="rounded-t-sm overflow-hidden">
      <CardHeader 
        className="flex" // flex 박스 모델 적용 및 아이템을 하단 정렬
        style={{ 
          backgroundImage: "url(/images/recCommsArt.png), linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75))", 
          backgroundSize: "cover", 
          backgroundBlendMode: "multiply",
          height: "100%" // 높이를 100%로 설정하여 전체 높이를 사용
        }}
      >
        <span className="font-bold text-background">Top Communities</span>
      </CardHeader>
      {/* <CardContent> */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableBody>
              {communities.map((community, index) => {
                const isJoined = !!communityStateValue.mySnippets.find((snippet) => snippet.communityId === community.id);
                return (
                  <Link key={community.id} href={`/r/${community.id}`}>
                    <TableRow key={community.id} className="flex items-center">
                      <TableCell className="w-1/5 flex justify-center">
                        <span>{index + 1}</span>
                      </TableCell>
                      <TableCell className="flex justify-center">                        
                        {community.imageURL ? (
                          <Avatar className="hidden h-9 w-9 sm:flex">
                          <AvatarImage src={community.imageURL} alt="community image" />
                          <AvatarFallback>404</AvatarFallback>
                          </Avatar>
                        ) : (
                          <FaReddit className="text-[#FF4500] text-7.5 mr-2" />
                        )}
                      </TableCell>
                      <TableCell className="w-full">
                        <span>{`r/${community.id}`}</span>
                      </TableCell>
                      <TableCell>
                        <Button
                          className={`h-5.5 text-xs ${isJoined ? "border border-blue-500" : "bg-blue-500 text-white"} rounded-md`}
                          onClick={(event) => {
                            event.stopPropagation();
                            onJoinLeaveCommunity(community, isJoined);
                          }}
                        >
                          {isJoined ? "Joined" : "Join"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  </Link>
                );
              })}
            </TableBody>
          </Table>
        )}
      {/* </CardContent> */}
    </Card>
  );
}

export default Recommendations;
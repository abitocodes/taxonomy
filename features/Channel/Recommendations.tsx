import { FC, useEffect, useState } from "react";
import { FaReddit } from "react-icons/fa";
import Link from "next/link";

import useChannelData from "@/hooks/useChannelData";
import { Channel } from "@/types/channelsState";
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
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const { channelStateValue, onJoinLeaveChannel } = useChannelData(); 

  function getChannelRecommendations() 
  { return fetch('/api/getChannelRecommendations'); }

  useEffect(() => {
    try {
      getChannelRecommendations().then(res => res.json()).then(data => { 
        const typedData = data.channels.map((channel: Channel) => ({
          ...channel,
          privacyType: channel.privacyType as "public" | "restricted" | "private",
          imageURL: channel.imageURL ?? undefined
        }));
        setChannels(typedData);
        setLoading(false);
      });
    }
    catch (error) {
      console.error("Error fetching channels", error);
    }
  }, []);

  return (
    <Card>
      <CardHeader 
        className="flex"
      >
        <span className="font-bold">상위 채널</span>
      </CardHeader>
      <CardContent className="flex item-center w-full">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table>
            <TableBody>
              {channels.map((channel, index) => {
                const isJoined = !!channelStateValue.mySnippets.find((snippet) => snippet.channelId === channel.id);
                return (
                    <TableRow key={channel.id} className="flex items-center">
                      <TableCell className="flex justify-center">
                        <span>{index + 1}</span>
                      </TableCell>
                      <TableCell className="flex justify-center"> 
                        <Link href={`/ch/${channel.id}`}>       
                          {channel.imageURL ? (
                            <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src={channel.imageURL} alt="channel image" />
                            <AvatarFallback>404</AvatarFallback>
                            </Avatar>
                          ) : (
                            <FaReddit className="text-[#FF4500] text-7.5 mr-2" />
                          )}
                        </Link>
                      </TableCell>
                      <TableCell className="w-full">
                        <Link href={`/ch/${channel.id}`}>  
                          <span>{`r/${channel.id}`}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Button
                          className={`h-5.5 text-xs ${isJoined ? "border border-blue-500" : "bg-blue-500 text-white"} rounded-md`}
                          onClick={(event) => {
                            event.stopPropagation();
                            onJoinLeaveChannel(channel, isJoined);
                          }}
                        >
                          {isJoined ? "Joined" : "Join"}
                        </Button>
                      </TableCell>

                    </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default Recommendations;
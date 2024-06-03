import { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useRecoilState, useSetRecoilState } from "recoil";

import { useRouter, usePathname } from "next/navigation";
import { authModalState } from "@/atoms/authModalAtom";
import { channelState, defaultChannel } from "@/atoms/channelsAtom";
import { getMySnippets } from "@/helpers/supabase";
import { Channel, ChannelSnippet } from "@/types/channelsState";
import { prisma } from "@/prisma/client";
import { Session } from '@supabase/supabase-js';

// const useChannelData = (ssrChannelData?: boolean) => {
const useChannelData = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const pathname = usePathname();
  const [channelStateValue, setChannelStateValue] = useRecoilState(channelState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const pathSegments = pathname?.split('/');
    if (pathSegments) {
      const channelIndex = pathSegments.indexOf('channel');
      const channelId = channelIndex !== -1 ? pathSegments[channelIndex + 1] : null;
      if (channelId) {
        getChannelData(channelId);
      } else {
        setChannelStateValue((prev) => ({
          ...prev,
          currentChannel: defaultChannel,
        }));
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (!user || !!channelStateValue.mySnippets.length) return;
    getSnippets();
  }, [user]);

  const getSnippets = async () => {
    setLoading(true);
    try {
      if (!user?.id) throw new Error("User ID is undefined");
      const snippets = await getMySnippets(user.id);
      setChannelStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as ChannelSnippet[],
        initSnippetsFetched: true,
      }));
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  const getChannelData = async (channelId: string) => {
    try {
      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
      });
  
      if (!channel) throw new Error('Channel not found');
  
      setChannelStateValue((prev) => ({
        ...prev,
        currentChannel: channel as Channel,
      }));
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  const onJoinLeaveChannel = (channel: Channel, isJoined?: boolean) => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setLoading(true);
    if (isJoined) {
      leaveChannel(channel.id);
      return;
    }
    joinChannel(channel);
  };

  const joinChannel = async (channel: Channel) => {
    try {
      // Insert new channel snippet for the user
      const newSnippet = await prisma.channelSnippet.create({
        data: {
          userId: user?.id,  // 'uid'를 'id'로 변경
          channelId: channel.id,
          imageURL: channel.imageURL || "",
        }
      });
  
      // Update the number of members in the channel
      const updatedChannel = await prisma.channel.update({
        where: { id: channel.id },
        data: {
          numberOfMembers: {
            increment: 1
          }
        }
      });
  
      // Add current channel to snippet
      setChannelStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, {
          channelId: channel.id,
          imageURL: channel.imageURL || "",
        }],
      }));
    } catch (error) {
    }
    setLoading(false);
  };

  const leaveChannel = async (channelId: string) => {
    try {  
      await prisma.$transaction(async (prisma) => {
        await prisma.channelSnippet.deleteMany({
          where: { channelId: channelId, userId: user?.id },
        });
  
        await prisma.channel.update({
          where: { id: channelId },
          data: { numberOfMembers: { decrement: 1 } },
        });
      });
  
      setChannelStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter((item) => item.channelId !== channelId),
      }));
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const pathSegments = pathname?.split('/');
    if (pathSegments) {
      const channelIndex = pathSegments.indexOf('channel');
      const channelId = channelIndex !== -1 ? pathSegments[channelIndex + 1] : null;
    
      if (channelId) {
        const channelData = channelStateValue.currentChannel;

        if (!channelData.id) {
          getChannelData(channelId);
          return;
        }
      } else {
        setChannelStateValue((prev) => ({
          ...prev,
          currentChannel: defaultChannel,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, channelStateValue.currentChannel]);

  return {
    channelStateValue,
    onJoinLeaveChannel,
    loading,
    setLoading,
    error,
  };
};

export default useChannelData;
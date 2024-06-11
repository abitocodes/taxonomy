"use client"

import { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useRecoilState } from "recoil";

import type { GetServerSidePropsContext, NextPage } from "next";
import safeJsonStringify from "safe-json-stringify";

import { channelState } from "@/atoms/channelsAtom";
import PageContentLayout from "@/components/reddit/Layout/PageContent";
import About from "@/features/Channel/About";
import ChannelNotFound from "@/features/Channel/ChannelNotFound";
import CreatePostLink from "@/features/Channel/CreatePostLink";
import Header from "@/features/Channel/Header";
import Posts from "@/features/Post/Posts";
import { Channel } from "@/types/channelsState";

import { Session } from '@supabase/supabase-js';

export default function ChannelPage ({ params }: { params: { channel: string } }) {
  const { user, loading: loadingUser, error: authErrorMsg } = useAuthState();
  const [channelStateValue, setChannelStateValue] = useRecoilState(channelState);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/getChannel?channelId=${params.channel}`);
        const channelData = await response.json();
        if (response.ok) {
          setChannelStateValue((prev) => ({
            ...prev,
            currentChannel: channelData,
          }));
        } else {
          throw new Error(channelData.error);
        }
      } catch (error) {
        console.error('Error fetching channel data:', error);
      }
    }
  
    fetchData();
  }, [params.channel]);

  // Channel was not found in the database
  if (!channelStateValue.currentChannel) {
    return <ChannelNotFound />;
  }

  return (
    <>
      <Header channelData={channelStateValue.currentChannel} />
      <PageContentLayout>
        {/* Left Content */}
        <>
          <CreatePostLink />
          <Posts channelData={channelStateValue.currentChannel} userId={user?.id} loadingUser={loadingUser} />
        </>
        {/* Right Content */}
        <>
          <About channelData={channelStateValue.currentChannel} />
        </>
      </PageContentLayout>
    </>
  );
};
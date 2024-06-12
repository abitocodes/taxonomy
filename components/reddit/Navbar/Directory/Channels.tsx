"use client"

import { FC, useState} from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { useRecoilValue } from "recoil";

import { channelState } from "@/atoms/channelsAtom";
import CreateChannelModal from "@/features/Channel/CreateChannel/CreateChannelModal";
import Moderating from "@/components/reddit/Navbar/Directory/Moderating";
import MyChannels from "@/components/reddit/Navbar/Directory/MyChannels";
import { Session } from '@supabase/supabase-js';
import { globalAuthState } from "@/atoms/globalAuthStateAtom";

const Channels: FC = () => {
  const { globalSessionData } = useRecoilValue(globalAuthState);
  const mySnippets = useRecoilValue(channelState).mySnippets;

  return (
    <>
      <CreateChannelModal userId={globalSessionData?.user?.id!} />
      <Moderating snippets={mySnippets.filter((item) => item.isModerator)} />
      <MyChannels snippets={mySnippets} />
    </>
  );
};

export default Channels;

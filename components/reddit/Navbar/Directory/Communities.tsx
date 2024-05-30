"use client"

import { FC, useState} from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { useRecoilValue } from "recoil";

import { communityState } from "@/atoms/communitiesAtom";
import CreateCommunityModal from "@/features/Community/CreateCommunity/CreateCommunityModal";
import Moderating from "./Moderating";
import MyCommunities from "./MyCommunities";
import { Session } from '@supabase/supabase-js';

const Communities: FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const mySnippets = useRecoilValue(communityState).mySnippets;

  return (
    <>
      <CreateCommunityModal userId={user?.id!} />
      <Moderating snippets={mySnippets.filter((item) => item.isModerator)} />
      <MyCommunities snippets={mySnippets} />
    </>
  );
};

export default Communities;

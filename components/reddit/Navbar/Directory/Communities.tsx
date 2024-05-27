import { FC } from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { useRecoilValue } from "recoil";

import { communityState } from "../@/atoms/communitiesAtom";
import CreateCommunityModal from "../../../features/Community/CreateCommunity/CreateCommunityModal";
import { auth } from "../../../firebase/clientApp";
import Moderating from "./Moderating";
import MyCommunities from "./MyCommunities";

const Communities: FC = () => {
  const { user, loading: authLoading, error: authError } = useAuthState();
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

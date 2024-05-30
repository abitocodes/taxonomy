"use client"

import { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useRecoilState } from "recoil";

import { doc, getDoc } from "firebase/firestore";
import type { GetServerSidePropsContext, NextPage } from "next";
import safeJsonStringify from "safe-json-stringify";

import { communityState } from "@/atoms/communitiesAtom";
import PageContentLayout from "@/components/reddit/Layout/PageContent";
import About from "@/features/Community/About";
import CommunityNotFound from "@/features/Community/CommunityNotFound";
import CreatePostLink from "@/features/Community/CreatePostLink";
import Header from "@/features/Community/Header";
import Posts from "@/features/Post/Posts";
import { auth, firestore } from "@/firebase/clientApp";
import { Community } from "@/types/CommunityState";

import { Session } from "@prisma/client";
import { Session } from "@supabase/supabase-js";

interface CommunityPageProps {
  communityData: Community;
}

const CommunityPage: NextPage<CommunityPageProps> = ({ communityData }) => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: loadingUser, error: authError } = useAuthState(session);

  const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);

  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityData]);

  // Community was not found in the database
  if (!communityData) {
    return <CommunityNotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        {/* Left Content */}
        <>
          <CreatePostLink />
          <Posts communityData={communityData} userId={user?.id} loadingUser={loadingUser} />
        </>
        {/* Right Content */}
        <>
          <About communityData={communityData} />
        </>
      </PageContentLayout>
    </>
  );
};

export default CommunityPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // console.log("GET SERVER SIDE PROPS RUNNING");

  try {
    const communityDocRef = doc(firestore, "communities", context.query.community as string);
    const communityDoc = await getDoc(communityDocRef);
    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }) // needed for dates
            )
          : "",
      },
    };
  } catch (error) {
    // Could create error page here
    // console.log("getServerSideProps error - [community]", error);
  }
}

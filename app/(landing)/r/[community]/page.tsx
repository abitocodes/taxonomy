"use client"

import { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useRecoilState } from "recoil";

import type { GetServerSidePropsContext, NextPage } from "next";
import safeJsonStringify from "safe-json-stringify";

import { communityState } from "@/atoms/communitiesAtom";
import PageContentLayout from "@/components/reddit/Layout/PageContent";
import About from "@/features/Community/About";
import CommunityNotFound from "@/features/Community/CommunityNotFound";
import CreatePostLink from "@/features/Community/CreatePostLink";
import Header from "@/features/Community/Header";
import Posts from "@/features/Post/Posts";
import { Community } from "@/types/CommunityState";

import { Session } from '@supabase/supabase-js';
import { supabase } from "@/utils/supabase/client";
import { prisma } from "@/prisma/client";

interface CommunityPageProps {
  communityData: Community;
}

function CommunityPage ({ params }: { params: { community: string } }) {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: loadingUser, error: authError } = useAuthState(session);
  const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
  console.log("CommunityPage called, params: ", params)

  useEffect(() => {
    async function fetchData() {
      const result = await getCommunityData(params.community);
      const communityData = result.props.communityData;
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: communityData,
      }));
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.community]);

  // Community was not found in the database
  if (!communityStateValue.currentCommunity) {
    return <CommunityNotFound />;
  }

  return (
    <>
      <Header communityData={communityStateValue.currentCommunity} />
      <PageContentLayout>
        {/* Left Content */}
        <>
          <CreatePostLink />
          <Posts communityData={communityStateValue.currentCommunity} userId={user?.id} loadingUser={loadingUser} />
        </>
        {/* Right Content */}
        <>
          <About communityData={communityStateValue.currentCommunity} />
        </>
      </PageContentLayout>
    </>
  );
};

export default CommunityPage;

export async function getCommunityData(communityId: string) {
  try {
    const communityData = await prisma.community.findUnique({
      where: {
        id: communityId as string,
      },
    });

    if (!communityData) throw new Error("Community not found");

    return {
      props: {
        communityData: communityData ? JSON.parse(safeJsonStringify(communityData)) : null,
      },
    };
  } catch (error) {
    console.error('getServerSideProps error - [community]', error);
    return {
      props: {
        communityData: null,
      },
    };
  }
}
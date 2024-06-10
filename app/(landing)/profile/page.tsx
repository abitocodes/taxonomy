"use client"

import { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useRecoilState } from "recoil";

import type { GetServerSidePropsContext, NextPage } from "next";
import safeJsonStringify from "safe-json-stringify";

import { sessionAndPublicUserState } from "@/atoms/sessionAndUserAtom";
import PageContentLayout from "@/components/reddit/Layout/PageContent";
// import AboutUser from "@/features/User/AboutUser";
// import UserNotFound from "@/features/User/UserNotFound";
// import Header from "@/features/User/Header";
import Posts from "@/features/Post/Posts";
// import { User } from "@/types/userProfileState";
import { PleaseLogin } from "@/components/PleaseLogin";

import { Session } from '@supabase/supabase-js';
import { UserProfileCard } from "@/components/UserProfileCard";
import { PublicUser } from "@prisma/client";
import { UserProfileTab } from "@/components/UserProfileTab";

export default function MyProfilePage () {
    const [session, setSession] = useState<Session | null>(null);
    const { user, loading: loadingUser, error: authError } = useAuthState(session);
    const [ publicUser, setPublicUser ] = useState<PublicUser | null>(null);

    const fetchData = async () => {
    if (!user) {
        return;
    }
    try {
        const response = await fetch(`/api/getPublicUser?userId=${user.id}`);
        const data = await response.json();
        const publicUserData = data.publicUserData;

        if (response.ok) {
            console.log("setPublicUserData: ", publicUserData)
            setPublicUser(publicUserData);
        } else {
        throw new Error(publicUserData.error || 'Unknown error occurred');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
    }

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <>
    <div id="profile" className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
         {publicUser ? (
        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto py-6 pr-2 md:sticky md:block lg:py-10">
            {/* <UserProfileCard/> */}
        </aside>
        ) : (
            <div>
            </div>
        )}
        <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
            {publicUser ? (
            <div id="center" className="mx-auto w-full min-w-0">
                <UserProfileTab/>
            </div>
        ) : (
            <div>
                <p>로그인이 필요합니다.</p>
            </div>
        )}
        </main>
    </div>


    </>
  );
};

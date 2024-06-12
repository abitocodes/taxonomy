"use client"

import { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useRecoilState } from "recoil";

import type { GetServerSidePropsContext, NextPage } from "next";
import safeJsonStringify from "safe-json-stringify";

import { globalAuthState } from "@/atoms/globalAuthStateAtom";
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
import { useRecoilValue } from "recoil";

export default function MyProfilePage () {
  const { globalPublicUserData } = useRecoilValue(globalAuthState);

  return (
    <>
    <div id="profile" className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
         {globalPublicUserData ? (
        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto py-6 pr-2 md:sticky md:block lg:py-10">
            {/* <UserProfileCard/> */}
        </aside>
        ) : (
            <div>
            </div>
        )}
        <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
            {globalPublicUserData ? (
            <div id="center" className="mx-auto w-full min-w-0">
                <UserProfileTab user={globalPublicUserData}/>
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

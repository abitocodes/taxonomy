"use client"

import { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useRecoilState } from "recoil";

import type { GetServerSidePropsContext, NextPage } from "next";
import safeJsonStringify from "safe-json-stringify";

import { genreState } from "@/atoms/genresAtom";
import PageContentLayout from "@/components/reddit/Layout/PageContent";
import About from "@/features/Genre/About";
import GenreNotFound from "@/features/Genre/GenreNotFound";
import CreatePostLink from "@/features/Genre/CreatePostLink";
import Header from "@/features/Genre/Header";
import Posts from "@/features/Post/Posts";
import { Genre } from "@/types/genresState";

import { Session } from '@supabase/supabase-js';

export default function GenrePage ({ params }: { params: { genre: string } }) {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: loadingUser, error: authError } = useAuthState(session);
  const [genreStateValue, setGenreStateValue] = useRecoilState(genreState);
  console.log("GenrePage called, params: ", params)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/getGenre?genreId=${params.genre}`);
        const genreData = await response.json();
        if (response.ok) {
          setGenreStateValue((prev) => ({
            ...prev,
            currentGenre: genreData,
          }));
        } else {
          throw new Error(genreData.error);
        }
      } catch (error) {
        console.error('Error fetching genre data:', error);
      }
    }
  
    fetchData();
  }, [params.genre]);

  // Genre was not found in the database
  if (!genreStateValue.currentGenre) {
    return <GenreNotFound />;
  }

  return (
    <>
      <Header genreData={genreStateValue.currentGenre} />
      <PageContentLayout>
        {/* Left Content */}
        <>
          <CreatePostLink />
          <Posts genreData={genreStateValue.currentGenre} userId={user?.id} loadingUser={loadingUser} />
        </>
        {/* Right Content */}
        <>
          <About genreData={genreStateValue.currentGenre} />
        </>
      </PageContentLayout>
    </>
  );
};
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
import { Genre } from "@/types/GenreState";

import { Session } from '@supabase/supabase-js';
import { supabase } from "@/utils/supabase/client";
import { prisma } from "@/prisma/client";

interface GenrePageProps {
  genreData: Genre;
}

function GenrePage ({ params }: { params: { genre: string } }) {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: loadingUser, error: authError } = useAuthState(session);
  const [genreStateValue, setGenreStateValue] = useRecoilState(genreState);
  console.log("GenrePage called, params: ", params)

  useEffect(() => {
    async function fetchData() {
      const result = await getGenreData(params.genre);
      const genreData = result.props.genreData;
      setGenreStateValue((prev) => ({
        ...prev,
        currentGenre: genreData,
      }));
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export default GenrePage;

export async function getGenreData(genreId: string) {
  try {
    const genreData = await prisma.genre.findUnique({
      where: {
        id: genreId as string,
      },
    });

    if (!genreData) throw new Error("Genre not found");

    return {
      props: {
        genreData: genreData ? JSON.parse(safeJsonStringify(genreData)) : null,
      },
    };
  } catch (error) {
    console.error('getServerSideProps error - [genre]', error);
    return {
      props: {
        genreData: null,
      },
    };
  }
}
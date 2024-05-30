import { useEffect, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useRecoilState, useSetRecoilState } from "recoil";

import { useRouter, useSearchParams } from "next/navigation";
import { authModalState } from "@/atoms/authModalAtom";
import { genreState, defaultGenre } from "@/atoms/genresAtom";
import { getMySnippets } from "@/helpers/supabase";
import { Genre, GenreSnippet } from "@/types/GenreState";
import { prisma } from "@/prisma/client";
import { Session } from '@supabase/supabase-js';

const useGenreData = (ssrGenreData?: boolean) => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [genreStateValue, setGenreStateValue] = useRecoilState(genreState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !!genreStateValue.mySnippets.length) return;

    getSnippets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getSnippets = async () => {
    setLoading(true);
    try {
      if (!user?.id) throw new Error("User ID is undefined");
      const snippets = await getMySnippets(user.id);
      setGenreStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as GenreSnippet[],
        initSnippetsFetched: true,
      }));
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  const getGenreData = async (genreId: string) => {
    try {
      const genre = await prisma.genre.findUnique({
        where: { id: genreId },
      });
  
      if (!genre) throw new Error('Genre not found');
  
      setGenreStateValue((prev) => ({
        ...prev,
        currentGenre: genre as Genre,
      }));
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  const onJoinLeaveGenre = (genre: Genre, isJoined?: boolean) => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setLoading(true);
    if (isJoined) {
      leaveGenre(genre.id);
      return;
    }
    joinGenre(genre);
  };

  const joinGenre = async (genre: Genre) => {
    // console.log("JOINING COMMUNITY: ", genre.id);
    try {
      // Insert new genre snippet for the user
      const newSnippet = await prisma.genreSnippet.create({
        data: {
          userId: user?.id,  // 'uid'를 'id'로 변경
          genreId: genre.id,
          imageURL: genre.imageURL || "",
        }
      });
  
      // Update the number of members in the genre
      const updatedGenre = await prisma.genre.update({
        where: { id: genre.id },
        data: {
          numberOfMembers: {
            increment: 1
          }
        }
      });
  
      // Add current genre to snippet
      setGenreStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, {
          genreId: genre.id,
          imageURL: genre.imageURL || "",
        }],
      }));
    } catch (error) {
      // console.log("joinGenre error", error);
    }
    setLoading(false);
  };

  const leaveGenre = async (genreId: string) => {
    try {  
      await prisma.$transaction(async (prisma) => {
        await prisma.genreSnippet.deleteMany({
          where: { genreId: genreId, userId: user?.id },
        });
  
        await prisma.genre.update({
          where: { id: genreId },
          data: { numberOfMembers: { decrement: 1 } },
        });
      });
  
      setGenreStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter((item) => item.genreId !== genreId),
      }));
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchParams) {
      const genreId = searchParams.get('genre');
      if (genreId) {
        const genreData = genreStateValue.currentGenre;

        if (!genreData.id) {
          getGenreData(genreId);
          return;
        }
      } else {
        setGenreStateValue((prev) => ({
          ...prev,
          currentGenre: defaultGenre,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, genreStateValue.currentGenre]);

  return {
    genreStateValue,
    onJoinLeaveGenre,
    loading,
    setLoading,
    error,
  };
};

export default useGenreData;
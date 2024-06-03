"use client"

import { FC, useState} from "react";
import { useAuthState } from "@/hooks/useAuthState"
import { useRecoilValue } from "recoil";

import { genreState } from "@/atoms/genresAtom";
import CreateGenreModal from "@/features/Genre/CreateGenre/CreateGenreModal";
import Moderating from "./Moderating";
import MyGenres from "./MyGenres";
import { Session } from '@supabase/supabase-js';

const Genres: FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const mySnippets = useRecoilValue(genreState).mySnippets;

  return (
    <>
      <CreateGenreModal userId={user?.id!} />
      <Moderating snippets={mySnippets.filter((item) => item.isModerator)} />
      <MyGenres snippets={mySnippets} />
    </>
  );
};

export default Genres;

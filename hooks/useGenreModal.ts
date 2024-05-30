import { useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useSetRecoilState } from "recoil";

import { authModalState } from "@/atoms/authModalAtom";
import { genreModalState } from "@/atoms/genreModalAtom";
import { Session } from '@supabase/supabase-js';

const useGenreModal = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const setAuthModalState = useSetRecoilState(authModalState);
  const setGenreModalState = useSetRecoilState(genreModalState);

  const openModal = () => {
    // check for user to open supabase.auth modal before redirecting to submit
    if (!user?.id) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setGenreModalState((prev) => ({ ...prev, open: true }));
  };

  const closeModal = () => {
    setGenreModalState((prev) => ({ ...prev, open: false }));
  };

  return { openModal, closeModal };
};

export default useGenreModal;

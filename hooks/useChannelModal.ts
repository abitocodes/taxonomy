import { useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useSetRecoilState } from "recoil";

import { authModalState } from "@/atoms/authModalAtom";
import { channelModalState } from "@/atoms/channelModalAtom";
import { Session } from '@supabase/supabase-js';

const useChannelModal = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const setAuthModalState = useSetRecoilState(authModalState);
  const setChannelModalState = useSetRecoilState(channelModalState);

  const openModal = () => {
    // check for user to open supabase.auth modal before redirecting to submit
    if (!user?.id) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setChannelModalState((prev) => ({ ...prev, open: true }));
  };

  const closeModal = () => {
    setChannelModalState((prev) => ({ ...prev, open: false }));
  };

  return { openModal, closeModal };
};

export default useChannelModal;
